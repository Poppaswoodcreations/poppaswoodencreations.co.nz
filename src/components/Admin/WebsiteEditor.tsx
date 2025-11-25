import React, { useState } from 'react';
import { Save, Eye, Code, Palette, Type, Image as ImageIcon, Layout, Plus, Edit, Trash2 } from 'lucide-react';

interface Page {
  id: string;
  name: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
}

interface WebsiteEditorProps {
  onSave: (changes: any) => void;
}

const WebsiteEditor: React.FC<WebsiteEditorProps> = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState('pages');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [showPageForm, setShowPageForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  const [pages, setPages] = useState<Page[]>([
    {
      id: 'home',
      name: 'Home Page',
      slug: 'home',
      title: 'Welcome to Poppa\'s Wooden Creations',
      content: `<section class="hero">
  <h1>Handcrafted Wooden Toys</h1>
  <p>Discover our beautiful collection of handcrafted wooden toys and kitchenware, made with love in New Zealand.</p>
  <button class="cta-button">Shop Now</button>
</section>

<section class="features">
  <div class="feature">
    <h3>Premium Quality</h3>
    <p>Handcrafted with attention to detail</p>
  </div>
  <div class="feature">
    <h3>Sustainable Materials</h3>
    <p>Made from sustainable New Zealand timber</p>
  </div>
  <div class="feature">
    <h3>Safe for Children</h3>
    <p>Non-toxic finishes and smooth edges</p>
  </div>
</section>`,
      isPublished: true,
      createdAt: '2024-01-01'
    },
    {
      id: 'about',
      name: 'About Us',
      slug: 'about',
      title: 'About Poppa\'s Wooden Creations',
      content: `<section class="about-hero">
  <h1>Our Story</h1>
  <p>Founded in 2015 by a passionate craftsman in Auckland, New Zealand.</p>
</section>

<section class="about-content">
  <h2>Crafting with Love</h2>
  <p>Every piece is handcrafted using traditional woodworking techniques and sustainable New Zealand timber.</p>
  
  <h2>Our Mission</h2>
  <p>To provide families with high-quality, sustainable toys that spark imagination and creativity.</p>
</section>`,
      isPublished: true,
      createdAt: '2024-01-01'
    }
  ]);

  const [siteSettings, setSiteSettings] = useState({
    general: {
      siteName: "Poppa's Wooden Creations",
      tagline: "Handcrafted in New Zealand",
      description: "Premium handcrafted wooden toys and kitchenware made with love in New Zealand",
      logo: "/logo.png",
      favicon: "/favicon.ico"
    },
    hero: {
      title: "Handcrafted Wooden Toys",
      subtitle: "Discover our beautiful collection of handcrafted wooden toys and kitchenware, made with love in New Zealand using sustainable materials.",
      backgroundImage: "/FB_IMG_1640827671355.jpg",
      ctaText: "Shop Now",
      secondaryCtaText: "Learn More"
    },
    colors: {
      primary: "#d97706",
      secondary: "#f59e0b",
      accent: "#92400e",
      background: "#ffffff",
      text: "#111827",
      textSecondary: "#6b7280"
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      headingSize: "large",
      bodySize: "medium"
    },
    layout: {
      headerStyle: "modern",
      footerStyle: "detailed",
      productGridColumns: 4,
      showBreadcrumbs: true,
      showProductRatings: true
    }
  });

  const [newPage, setNewPage] = useState({
    name: '',
    slug: '',
    title: '',
    content: '',
    isPublished: false
  });

  const tabs = [
    { id: 'pages', label: 'Pages', icon: Layout },
    { id: 'general', label: 'General', icon: Type },
    { id: 'hero', label: 'Hero Section', icon: Eye },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Code }
  ];

  const handleSavePage = () => {
    if (editingPage) {
      setPages(pages.map(p => p.id === editingPage.id ? { ...editingPage } : p));
    } else {
      const page: Page = {
        ...newPage,
        id: `page-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPages([...pages, page]);
    }
    setShowPageForm(false);
    setEditingPage(null);
    setNewPage({ name: '', slug: '', title: '', content: '', isPublished: false });
  };

  const handleDeletePage = (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(p => p.id !== pageId));
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSaveAll = () => {
    try {
      const changes = {
        pages,
        siteSettings,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('poppas-website-settings', JSON.stringify(changes));
      console.log('💾 Website settings saved to localStorage:', changes);
      
      // Also call the onSave callback
      onSave(changes);
      
      // Verify save
      const verification = localStorage.getItem('poppas-website-settings');
      if (verification) {
        console.log('✅ Website save verified');
        alert('Website changes saved successfully!');
      } else {
        throw new Error('Save verification failed');
      }
    } catch (error) {
      console.error('❌ Failed to save website settings:', error);
      alert('Failed to save website settings. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Website Pages</h3>
              <button
                onClick={() => setShowPageForm(true)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Page</span>
              </button>
            </div>

            <div className="grid gap-4">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{page.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          page.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">/{page.slug}</p>
                      <p className="text-sm text-gray-500 mt-1">Created: {page.createdAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingPage(page);
                          setShowPageForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Page Form Modal */}
            {showPageForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingPage ? 'Edit Page' : 'Add New Page'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                          <input
                            type="text"
                            value={editingPage ? editingPage.name : newPage.name}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (editingPage) {
                                setEditingPage({ ...editingPage, name: value, slug: generateSlug(value) });
                              } else {
                                setNewPage({ ...newPage, name: value, slug: generateSlug(value) });
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                          <input
                            type="text"
                            value={editingPage ? editingPage.slug : newPage.slug}
                            onChange={(e) => {
                              if (editingPage) {
                                setEditingPage({ ...editingPage, slug: e.target.value });
                              } else {
                                setNewPage({ ...newPage, slug: e.target.value });
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                          type="text"
                          value={editingPage ? editingPage.title : newPage.title}
                          onChange={(e) => {
                            if (editingPage) {
                              setEditingPage({ ...editingPage, title: e.target.value });
                            } else {
                              setNewPage({ ...newPage, title: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Content (HTML)</label>
                        <textarea
                          rows={12}
                          value={editingPage ? editingPage.content : newPage.content}
                          onChange={(e) => {
                            if (editingPage) {
                              setEditingPage({ ...editingPage, content: e.target.value });
                            } else {
                              setNewPage({ ...newPage, content: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                          placeholder="Enter HTML content for your page..."
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPublished"
                          checked={editingPage ? editingPage.isPublished : newPage.isPublished}
                          onChange={(e) => {
                            if (editingPage) {
                              setEditingPage({ ...editingPage, isPublished: e.target.checked });
                            } else {
                              setNewPage({ ...newPage, isPublished: e.target.checked });
                            }
                          }}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                          Publish this page
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleSavePage}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        {editingPage ? 'Update Page' : 'Create Page'}
                      </button>
                      <button
                        onClick={() => {
                          setShowPageForm(false);
                          setEditingPage(null);
                          setNewPage({ name: '', slug: '', title: '', content: '', isPublished: false });
                        }}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={siteSettings.general.siteName}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    general: { ...siteSettings.general, siteName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={siteSettings.general.tagline}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    general: { ...siteSettings.general, tagline: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea
                rows={3}
                value={siteSettings.general.description}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  general: { ...siteSettings.general, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
              <input
                type="text"
                value={siteSettings.hero.title}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  hero: { ...siteSettings.hero, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                rows={3}
                value={siteSettings.hero.subtitle}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  hero: { ...siteSettings.hero, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
                <input
                  type="text"
                  value={siteSettings.hero.ctaText}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    hero: { ...siteSettings.hero, ctaText: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                <input
                  type="text"
                  value={siteSettings.hero.secondaryCtaText}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    hero: { ...siteSettings.hero, secondaryCtaText: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Color Scheme</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(siteSettings.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        colors: { ...siteSettings.colors, [key]: e.target.value }
                      })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        colors: { ...siteSettings.colors, [key]: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSaveAll}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteEditor;