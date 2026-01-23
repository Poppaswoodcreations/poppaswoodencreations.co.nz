// src/pages/blog/BlogPostView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_alt: string;
  category: string;
  author: string;
  published_at: string;
  read_time: string;
  meta_description: string;
  tags: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  created_at: string;
  updated_at: string;
}

const BlogPostView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        
        // Check if supabase client is initialized
        if (!supabase) {
          throw new Error('Supabase client not initialized. Please check your environment variables.');
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-4">
            Looking for: <code className="bg-gray-200 px-2 py-1 rounded">{slug}</code>
          </p>
          <Link to="/blog" className="text-amber-600 hover:text-amber-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description,
    "image": post.featured_image,
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Poppa's Wooden Creations",
      "url": "https://poppaswoodencreations.co.nz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Poppa's Wooden Creations",
      "logo": {
        "@type": "ImageObject",
        "url": "https://poppaswoodencreations.co.nz/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://poppaswoodencreations.co.nz/blog/${slug}`
    }
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://poppaswoodencreations.co.nz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://poppaswoodencreations.co.nz/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://poppaswoodencreations.co.nz/blog/${slug}`
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Poppa's Wooden Creations</title>
        <meta name="description" content={post.meta_description} />
        <meta name="keywords" content={post.tags.join(', ')} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:url" content={`https://poppaswoodencreations.co.nz/blog/${slug}`} />
        <meta property="og:type" content="article" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.meta_description} />
        <meta name="twitter:image" content={post.featured_image} />
        
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <article className="min-h-screen bg-white">
        <div className="relative h-[400px] bg-gray-900">
          <img
            src={post.featured_image}
            alt={post.image_alt}
            className="w-full h-full object-cover opacity-60"
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-white text-sm">
                <span>{post.author}</span>
                <span>•</span>
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString()}
                </time>
                <span>•</span>
                <span>{post.read_time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="mb-8 text-sm">
            <Link to="/" className="text-amber-600 hover:text-amber-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/blog" className="text-amber-600 hover:text-amber-700">Blog</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{post.title}</span>
          </nav>

          {/* Blog post content - rendered as HTML from Supabase */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/blog"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostView;
