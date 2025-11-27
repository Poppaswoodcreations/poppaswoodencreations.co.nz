// src/pages/blog/BlogListView.tsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from './blogData';
import { BlogCard } from '../../components/BlogCard';

interface BlogListViewProps {
  onPostSelect: (slug: string) => void;
  onNavigate: (view: string) => void;
}

export const BlogListView: React.FC<BlogListViewProps> = ({ onPostSelect, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Wooden Toy Tips & Parenting Guides | Poppa's Wooden Creations Blog</title>
        <meta
          name="description"
          content="Expert advice on wooden toys, child development, and safe play from New Zealand's premier handcrafted wooden toy makers. Tips for parents and educators."
        />
        <link rel="canonical" href="https://poppaswoodencreations.co.nz/blog" />
        <meta property="og:title" content="Wooden Toy Tips & Parenting Guides | Blog" />
        <meta property="og:description" content="Expert advice on wooden toys and child development from New Zealand's wooden toy experts." />
        <meta property="og:url" content="https://poppaswoodencreations.co.nz/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Wooden Toy Tips & Parent Guides
              </h1>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                Expert advice on choosing, using, and caring for wooden toys. 
                Plus insights on child development and sustainable parenting from our Whangarei workshop.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-amber-600">
              Home
            </button>
            <span>/</span>
            <span className="text-gray-900">Blog</span>
          </nav>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <div key={post.slug} onClick={() => onPostSelect(post.slug)} className="cursor-pointer">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No posts found in this category.
              </p>
            </div>
          )}

          {/* Newsletter Signup Section (Optional) */}
          <div className="mt-16 bg-amber-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Want More Tips & Updates?
            </h2>
            <p className="text-gray-700 mb-6">
              Get expert parenting tips and new product updates delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
