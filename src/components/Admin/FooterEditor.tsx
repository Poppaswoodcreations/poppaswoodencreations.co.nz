import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
  id: string;
  title: string;
  url: string;
  category: 'quick-links' | 'categories' | 'legal';
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface FooterData {
  companyName: string;
  tagline: string;
  description: string;
  links: FooterLink[];
  socialMedia: SocialMedia;
  contactInfo: ContactInfo;
  copyrightText: string;
}

interface FooterEditorProps {
  onSave: (footerData: FooterData) => void;
}

const FooterEditor: React.FC<FooterEditorProps> = ({ onSave }) => {
  const [footerData, setFooterData] = useState<FooterData>({
    companyName: "Poppa's Wooden Creations",
    tagline: "Handcrafted in New Zealand",
    description: "Creating beautiful, safe wooden toys with love and attention to detail since 2015.",
    links: [
      { id: '1', title: 'Home', url: '/', category: 'quick-links' },
      { id: '2', title: 'About Us', url: '/about', category: 'quick-links' },
      { id: '3', title: 'All Products', url: '/products', category: 'quick-links' },
      { id: '4', title: 'Contact', url: '/contact', category: 'quick-links' },
      { id: '5', title: 'Shipping & Returns', url: '/shipping', category: 'quick-links' },
      { id: '6', title: 'Wooden Trains', url: '/wooden-trains', category: 'categories' },
      { id: '7', title: 'Baby Toys', url: '/wooden-baby-toys', category: 'categories' },
      { id: '8', title: 'Trucks', url: '/wooden-trucks', category: 'categories' },
      { id: '9', title: 'Cars', url: '/wooden-cars', category: 'categories' },
      { id: '10', title: 'Kitchenware', url: '/wooden-kitchenware', category: 'categories' }
    ],
    socialMedia: {
      facebook: 'https://facebook.com/poppaswooden',
      instagram: 'https://instagram.com/poppaswooden',
      twitter: ''
    },
    contactInfo: {
      address: '102 Kiripaka Rd\nWhangarei, Northland 0110\nNew Zealand',
      phone: '+64 21 022 8166',
      email: 'poppas.wooden.creations@gmail.com',
      hours: 'Mon-Fri: 9AM-3PM NZST\nSaturday: Closed\nSunday: Closed'
    },
    copyrightText: '© 2024 Poppa\'s Wooden Creations. Made with ❤️ in New Zealand'
  });

  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [newLink, setNewLink] = useState<Omit<FooterLink, 'id'>>({
    title: '',
    url: '',
    category: 'quick-links'
  });

  // Load saved footer data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-footer-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFooterData(parsed);
        console.log('📄 Loaded saved footer data');
      }
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('poppas-footer-settings', JSON.stringify(footerData));
      console.log('💾 Footer settings saved:', footerData);
      onSave(footerData);
      alert('Footer settings saved successfully!');
    } catch (error) {
      console.error('❌ Failed to save footer settings:', error);
      alert('Failed to save footer settings. Please try again.');
    }
  };

  const handleAddLink = () => {
    const link: FooterLink = {
      ...newLink,
      id: `link-${Date.now()}`
    };
    setFooterData({
      ...footerData,
      links: [...footerData.links, link]
    });
    setNewLink({ title: '', url: '', category: 'quick-links' });
    setShowLinkForm(false);
  };

  const handleEditLink = (link: FooterLink) => {
    setEditingLink(link);
    setNewLink({ title: link.title, url: link.url, category: link.category });
    setShowLinkForm(true);
  };

  const handleUpdateLink = () => {
    if (editingLink) {
      setFooterData({
        ...footerData,
        links: footerData.links.map(link =>
          link.id === editingLink.id
            ? { ...editingLink, ...newLink }
            : link
        )
      });
      setEditingLink(null);
      setNewLink({ title: '', url: '', category: 'quick-links' });
      setShowLinkForm(false);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setFooterData({
        ...footerData,
        links: footerData.links.filter(link => link.id !== linkId)
      });
    }
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setFooterData({
      ...footerData,
      contactInfo: {
        ...footerData.contactInfo,
        [field]: value
      }
    });
  };

  const updateSocialMedia = (field: keyof SocialMedia, value: string) => {
    setFooterData({
      ...footerData,
      socialMedia: {
        ...footerData.socialMedia,
        [field]: value
      }
    });
  };

  const getLinksByCategory = (category: string) => {
    return footerData.links.filter(link => link.category === category);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Footer Editor</h3>
        <button
          onClick={handleSave}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Footer</span>
        </button>
      </div>

      {/* Company Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Company Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={footerData.companyName}
              onChange={(e) => setFooterData({ ...footerData, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              value={footerData.tagline}
              onChange={(e) => setFooterData({ ...footerData, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={footerData.description}
            onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
          <input
            type="text"
            value={footerData.copyrightText}
            onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="mr-2 text-amber-600" size={20} />
          Contact Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows={3}
              value={footerData.contactInfo.address}
              onChange={(e) => updateContactInfo('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
            <textarea
              rows={3}
              value={footerData.contactInfo.hours}
              onChange={(e) => updateContactInfo('hours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={footerData.contactInfo.phone}
              onChange={(e) => updateContactInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={footerData.contactInfo.email}
              onChange={(e) => updateContactInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Social Media Links</h4>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Facebook className="text-blue-600" size={20} />
            <input
              type="url"
              placeholder="https://facebook.com/yourbusiness"
              value={footerData.socialMedia.facebook}
              onChange={(e) => updateSocialMedia('facebook', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Instagram className="text-pink-600" size={20} />
            <input
              type="url"
              placeholder="https://instagram.com/yourbusiness"
              value={footerData.socialMedia.instagram}
              onChange={(e) => updateSocialMedia('instagram', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Twitter className="text-blue-400" size={20} />
            <input
              type="url"
              placeholder="https://twitter.com/yourbusiness (optional)"
              value={footerData.socialMedia.twitter}
              onChange={(e) => updateSocialMedia('twitter', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Footer Links</h4>
          <button
            onClick={() => setShowLinkForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Link</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Quick Links</h5>
            <div className="space-y-2">
              {getLinksByCategory('quick-links').map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{link.title}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Categories</h5>
            <div className="space-y-2">
              {getLinksByCategory('categories').map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{link.title}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Legal</h5>
            <div className="space-y-2">
              {getLinksByCategory('legal').map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{link.title}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Link Form Modal */}
      {showLinkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Title</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="quick-links">Quick Links</option>
                  <option value="categories">Categories</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={editingLink ? handleUpdateLink : handleAddLink}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                {editingLink ? 'Update Link' : 'Add Link'}
              </button>
              <button
                onClick={() => {
                  setShowLinkForm(false);
                  setEditingLink(null);
                  setNewLink({ title: '', url: '', category: 'quick-links' });
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterEditor;