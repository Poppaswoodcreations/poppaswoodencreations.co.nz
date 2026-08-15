import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Category, Product } from '../../types';
import { categories as defaultCategories } from '../../data/products';
import { supabase } from '../../lib/supabase';

const ADMIN_PASSWORD = 'Adrianbar1?';

interface CategoryManagerProps {
  products: Product[];
  onSave: (categories: Category[]) => void;
}

// FIX (16 Aug 2026): this component previously saved only to
// localStorage['poppas-categories'] — edits never reached the live site for
// real visitors, since nothing else in the app reads that key. Rewired to
// load from and save to the site_settings table (same pattern HeroEditor
// uses), via the existing /api/admin-site-settings endpoint.
//
// Also removed the manually-typed "Product Count" field. It had no
// connection to real product data and could silently drift from reality —
// this is the likely cause of a category showing "0 products" on the
// homepage despite genuinely having products in it. Counts are now computed
// live from the actual `products` list passed in from AdminDashboard.
const CategoryManager: React.FC<CategoryManagerProps> = ({ products, onSave }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading categories from Supabase:', error);
        setCategories(defaultCategories);
        return;
      }

      if (data) {
        setSettingsId(data.id);
        const stored = data.categories;
        if (Array.isArray(stored) && stored.length > 0) {
          setCategories(stored);
          console.log('📂 Loaded categories from Supabase:', stored.length);
        } else {
          setCategories(defaultCategories);
          console.log('📂 No stored categories yet — using defaults');
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  // Live count from actual products — never stored, always fresh.
  const countFor = (slug: string) => products.filter(p => p.category === slug).length;

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      if (!settingsId) {
        throw new Error('Missing site_settings row id — try refreshing the page.');
      }
      const res = await fetch('/api/admin-site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          action: 'update',
          id: settingsId,
          updates: { categories },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save categories');

      console.log('💾 Categories saved to Supabase');
      setSaveMessage('Categories saved successfully! Changes are live.');
      onSave(categories);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('❌ Failed to save categories:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save categories.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '', seoTitle: '', seoDescription: '', seoKeywords: '' });
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || '',
      seoKeywords: category.seoKeywords || ''
    });
    setShowForm(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...editingCategory, ...formData, productCount: countFor(formData.slug) }
          : cat
      ));
    } else {
      const newCategory: Category = {
        ...formData,
        id: `cat-${Date.now()}`,
        productCount: countFor(formData.slug),
      };
      setCategories([...categories, newCategory]);
    }

    setShowForm(false);
    setEditingCategory(null);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span>Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Category Manager</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleAddCategory}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveMessage}</div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{saveError}</div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/FB_IMG_1640827671355.jpg';
                }}
              />
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
            <p className="text-xs text-gray-500 mb-4">
              Slug: /{category.slug} • Products: {countFor(category.slug)}
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditCategory(category)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({
                          ...formData,
                          name,
                          slug: formData.slug || generateSlug(name)
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Image URL or upload from Image Manager"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Category preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/FB_IMG_1640827671355.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Product Count field removed — it's now computed live from
                    real product data (see countFor above) rather than typed
                    manually, since a manual number could never stay accurate. */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  Product count for this category will show automatically based on real products — no need to enter it manually.
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
