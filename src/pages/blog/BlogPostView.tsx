// src/pages/blog/BlogListView.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from './blogData';

const BlogListView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);
  
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wooden Toy Guides & Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Expert insights on wooden toys, child development, and sustainable craftsmanship from Poppa's Wooden Creations in Whangarei, New Zealand.
          </p>
        </div>
      </div>
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden bg-gray-200">
                <img
                  src={post.featuredImage}
                  alt={post.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full mb-3">
                  {post.category}
                </span>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No posts found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListView;
