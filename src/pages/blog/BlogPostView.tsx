// src/pages/blog/BlogPostView.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from './blogData';
import { getBlogContent } from './blogContent';

interface BlogPostViewProps {
  slug: string | null;
  onNavigate: (view: string) => void;
  onPostSelect: (slug: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ slug, onNavigate, onPostSelect }) => {
  // Find the post
  const post = blogPosts.find(p => p.slug === slug);

  // If post not found, redirect to blog list
  if (!post) {
    onNavigate('blog');
    return null;
  }

  // Get the full content for this post
  const content = getBlogContent(post.slug);

  // Related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.title} | Poppa's Wooden Creations Blog</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://poppaswoodencreations.co.nz/blog/${post.slug}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={`https://poppaswoodencreations.co.nz/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://poppaswoodencreations.co.nz${post.featuredImage}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={`https://poppaswoodencreations.co.nz${post.featuredImage}`} />
      </Helmet>

      <article className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <button onClick={() => onNavigate('home')} className="hover:text-amber-600">
                Home
              </button>
              <span>/</span>
              <button onClick={() => onNavigate('blog')} className="hover:text-amber-600">
                Blog
              </button>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="bg-white py-12 mb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category & Read Time */}
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              <span className="text-gray-600">{post.readTime}</span>
              <time dateTime={post.date} className="text-gray-600">
                {new Date(post.date).toLocaleDateString('en-NZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-600">Whangarei, New Zealand</p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <img
            src={post.featuredImage}
            alt={post.imageAlt}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {content}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Share this article:</h3>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Facebook
                </button>
                <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500">
                  Twitter
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-amber-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Love Wooden Toys?
              </h3>
              <p className="text-gray-700 mb-6">
                Explore our handcrafted collection made right here in Whangarei, New Zealand.
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Browse Our Collection
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <button
                    key={relatedPost.slug}
                    onClick={() => onPostSelect(relatedPost.slug)}
                    className="group text-left"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.imageAlt}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {relatedPost.readTime}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
};
