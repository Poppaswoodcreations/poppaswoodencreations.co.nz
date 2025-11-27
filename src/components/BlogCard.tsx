// src/components/BlogCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../pages/blog/blogData';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Featured Image */}
      <Link to={`/blog/${post.slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.imageAlt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category & Read Time */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
            {post.category}
          </span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-amber-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-NZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <Link
            to={`/blog/${post.slug}`}
            className="text-amber-600 hover:text-amber-700 font-semibold hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};
