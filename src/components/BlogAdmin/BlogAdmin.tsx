// src/components/BlogAdmin/BlogAdmin.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BlogAdminProps {
  onClose: () => void;
}

interface BlogPostForm {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  tags: string;
  content: string;
  readTime: string;
}

export const BlogAdmin: React.FC<BlogAdminProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<BlogPostForm>({
    slug: '',
    title: '',
    metaDescription: '',
    excerpt: '',
    category: '',
    tags: '',
    content: '',
    readTime: '5 min read'
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [step, setStep] = useState<'form' | 'preview' | 'code'>('form');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const convertHTMLToTSX = (html: string): string => {
    // Convert HTML to TSX format
    let tsx = html
      // Replace class with className
      .replace(/class=/g, 'className=')
      // Replace style attributes
      .replace(/style="([^"]*)"/g, (match, styles) => {
        const styleObj = styles.split(';')
          .filter((s: string) => s.trim())
          .map((s: string) => {
            const [key, value] = s.split(':').map((p: string) => p.trim());
            const camelKey = key.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
            return `${camelKey}: '${value}'`;
          })
          .join(', ');
        return `style={{ ${styleObj} }}`;
      })
      // Self-close tags
      .replace(/<(img|br|hr|input)([^>]*)>/g, '<$1$2 />')
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return tsx;
  };

  const generateBlogCode = () => {
    const today = new Date().toISOString().split('T')[0];
    const tsxContent = convertHTMLToTSX(formData.content);
    const tagsArray = formData.tags.split(',').map(t => `'${t.trim()}'`).join(', ');

    // Generate blogData.ts entry
    const dataCode = `
// ADD THIS TO blogData.ts in the blogPosts array:
{
  slug: '${formData.slug}',
  title: '${formData.title}',
  metaDescription: '${formData.metaDescription}',
  excerpt: '${formData.excerpt}',
  author: 'Poppa\\'s Wooden Creations',
  date: '${today}',
  readTime: '${formData.readTime}',
  category: '${formData.category}',
  tags: [${tagsArray}],
  featuredImage: '/images/blog/${formData.slug}.jpg',
  imageAlt: '${formData.title}',
  content: null
},`;

    // Generate blogContent.tsx entry
    const componentName = formData.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Content';

    const contentCode = `
// ADD THIS CASE to getBlogContent function in blogContent.tsx:
case '${formData.slug}':
  return <${componentName} />;

// ADD THIS COMPONENT at the bottom of blogContent.tsx:
// ==========================================
// BLOG POST: ${formData.title}
// ==========================================
const ${componentName}: React.FC = () => (
  <>
    ${tsxContent}
  </>
);`;

    setGeneratedCode(dataCode + '\n\n' + contentCode);
    setStep('code');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Blog Post Admin Panel
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className={`flex items-center ${step === 'form' ? 'text-amber-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                  1
                </div>
                <span className="ml-2">Fill Form</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              <div className={`flex items-center ${step === 'preview' ? 'text-amber-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                  2
                </div>
                <span className="ml-2">Preview</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              <div className={`flex items-center ${step === 'code' ? 'text-amber-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                  3
                </div>
                <span className="ml-2">Get Code</span>
              </div>
            </div>

            {/* Form Step */}
            {step === 'form' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Blog Post Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., How to Care for Wooden Toys"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {formData.slug && (
                    <p className="mt-2 text-sm text-gray-600">
                      URL slug: <code className="bg-gray-100 px-2 py-1 rounded">{formData.slug}</code>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Meta Description (150-160 characters) *
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Brief SEO description for Google search results"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={2}
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    {formData.metaDescription.length} / 160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Excerpt (Brief summary) *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short summary that appears on the blog listing page"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Care & Maintenance"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g., 5 min read"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tags (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., wooden toys, cleaning, maintenance"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Blog Content (HTML or Plain Text) *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Paste your HTML content here or write plain text with <p>, <h2>, <ul>, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                    rows={15}
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    💡 Tip: You can paste HTML directly from your blog generator or write simple HTML
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('preview')}
                    disabled={!formData.title || !formData.content}
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Preview & Generate Code →
                  </button>
                </div>
              </div>
            )}

            {/* Preview Step */}
            {step === 'preview' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Preview</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Title:</span>
                      <p className="text-lg font-bold">{formData.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Slug:</span>
                      <p className="text-sm font-mono bg-white px-2 py-1 rounded inline-block">
                        /blog/{formData.slug}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Category:</span>
                      <p>{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Tags:</span>
                      <p>{formData.tags}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Content Preview:</span>
                      <div 
                        className="mt-2 prose max-w-none bg-white p-4 rounded border max-h-64 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: formData.content.substring(0, 500) + '...' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    onClick={generateBlogCode}
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Generate Code →
                  </button>
                </div>
              </div>
            )}

            {/* Code Step */}
            {step === 'code' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-bold text-green-900 mb-2">✅ Code Generated!</h3>
                  <p className="text-green-800 text-sm">
                    Copy the code below and follow the instructions to add your blog post.
                  </p>
                </div>

                <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold">Generated Code</span>
                    <button
                      onClick={() => copyToClipboard(generatedCode)}
                      className="bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700 transition-colors"
                    >
                      Copy All Code
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{generatedCode}</code>
                  </pre>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-3">📋 Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-900 text-sm">
                    <li>Copy the first section and add it to <code className="bg-white px-2 py-1 rounded">src/pages/blog/blogData.ts</code></li>
                    <li>Copy the second section and add it to <code className="bg-white px-2 py-1 rounded">src/pages/blog/blogContent.tsx</code></li>
                    <li>Add a featured image to <code className="bg-white px-2 py-1 rounded">public/images/blog/{formData.slug}.jpg</code></li>
                    <li>Commit to GitHub and deploy!</li>
                  </ol>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ← Create Another Post
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
