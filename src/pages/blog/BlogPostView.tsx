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

  // Share URLs
  const currentUrl = `https://poppaswoodencreations.co.nz/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedText = encodeURIComponent(`${post.title} - Check out this article from Poppa's Wooden Creations!`);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.title} | Poppa's Wooden Creations Blog</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.featuredImage.startsWith('http') ? post.featuredImage : `https://poppaswoodencreations.co.nz${post.featuredImage}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.featuredImage.startsWith('http') ? post.featuredImage : `https://poppaswoodencreations.co.nz${post.featuredImage}`} />
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
              <div className="flex flex-wrap gap-3">
                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>

                {/* Twitter/X Share */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter
                </a>

                {/* WhatsApp Share */}
                <a
                  href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>

                {/* Email Share */}
                <a
                  href={`mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  aria-label="Share via Email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  aria-label="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
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
