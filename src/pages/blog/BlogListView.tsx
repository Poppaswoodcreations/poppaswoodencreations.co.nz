// src/pages/blog/BlogListView.tsx
// Blog listing page with optimized images

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from './blogData';
import OptimizedImage from '../../components/OptimizedImage';

const BlogListView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image with optimization */}
              <div className="aspect-video overflow-hidden bg-gray-200">
                <OptimizedImage
                  src={post.featuredImage}
                  alt={post.imageAlt}
                  width={600}
                  height={400}
                  loading="lazy"
                  quality={85}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  objectFit="cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category badge */}
                <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full mb-3">
                  {post.category}
                </span>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.readTime}</span>
                  <span>{new Date(post.date).toLocaleDateString('en-NZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No results message */}
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
