import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, Filter, Calendar, Award, CheckCircle } from 'lucide-react';
import ReviewsSchema from './ReviewsSchema';
import { supabase } from '../lib/supabaseClient';

interface Review {
  id: string;
  author_name: string;
  rating: number;
  review_title?: string;
  review_text?: string;
  review_date: string;
  source: 'google' | 'website';
  local_guide?: boolean;
  review_count?: number;
  photo_count?: number;
  verified?: boolean;
  category?: string;
  product_name?: string;
}

const Reviews: React.FC = () => {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);
  const [filterSource, setFilterSource] = useState<'all' | 'google' | 'website'>('all');

  // Fetch reviews from Supabase
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', true)
        .order('review_date', { ascending: false });

      if (error) throw error;
      setAllReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredReviews = allReviews.filter(review => {
    if (filterRating > 0 && review.rating !== filterRating) return false;
    if (filterSource !== 'all' && review.source !== filterSource) return false;
    return true;
  });

  const totalReviews = allReviews.length;
  const googleReviews = allReviews.filter(r => r.source === 'google').length;
  const websiteReviews = allReviews.filter(r => r.source === 'website').length;
  
  // Calculate average
  const totalStars = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : '5.0';

  const ratingDistribution = [
    { rating: 5, count: allReviews.filter(r => r.rating === 5).length },
    { rating: 4, count: allReviews.filter(r => r.rating === 4).length },
    { rating: 3, count: allReviews.filter(r => r.rating === 3).length },
    { rating: 2, count: allReviews.filter(r => r.rating === 2).length },
    { rating: 1, count: allReviews.filter(r => r.rating === 1).length }
  ].map(item => ({
    ...item,
    percentage: totalReviews > 0 ? (item.count / totalReviews) * 100 : 0
  }));

  const renderStars = (rating: number, size: number = 16) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks < 8) return `${diffWeeks} weeks ago`;
    
    return date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <>
      <ReviewsSchema 
        ratingValue={parseFloat(averageRating)} 
        reviewCount={totalReviews}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-700 to-amber-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <Award size={48} className="mr-4" />
                <div className="text-left">
                  <div className="flex items-center mb-2">
                    <span className="text-5xl font-bold mr-3">{averageRating}</span>
                    {renderStars(5, 24)}
                  </div>
                  <p className="text-xl opacity-90">Based on {totalReviews} verified reviews</p>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Customer Reviews & Testimonials
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                See why Whangarei families trust Poppa's Wooden Creations for handcrafted, 
                heirloom-quality toys made from native NZ timber
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Trust Badges */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-amber-700 mb-2">{averageRating}★</div>
                    <p className="text-gray-600 text-sm">Average Rating</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-700 mb-2">{totalReviews}</div>
                    <p className="text-gray-600 text-sm">Total Reviews</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-700 mb-2">{googleReviews}</div>
                    <p className="text-gray-600 text-sm">Google Reviews</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-700 mb-2">{websiteReviews}</div>
                    <p className="text-gray-600 text-sm">Website Reviews</p>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rating Breakdown</h2>
                <div className="space-y-3">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700 w-16">{rating} stars</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <Filter size={20} className="text-gray-500" />
                      <label htmlFor="rating-filter" className="text-sm font-medium text-gray-700">
                        Rating:
                      </label>
                      <select
                        id="rating-filter"
                        value={filterRating}
                        onChange={(e) => setFilterRating(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                      >
                        <option value={0}>All Ratings</option>
                        <option value={5}>5 Stars ({ratingDistribution[0].count})</option>
                        <option value={4}>4 Stars ({ratingDistribution[1].count})</option>
                        <option value={3}>3 Stars ({ratingDistribution[2].count})</option>
                        <option value={2}>2 Stars ({ratingDistribution[3].count})</option>
                        <option value={1}>1 Star ({ratingDistribution[4].count})</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-3">
                      <label htmlFor="source-filter" className="text-sm font-medium text-gray-700">
                        Source:
                      </label>
                      <select
                        id="source-filter"
                        value={filterSource}
                        onChange={(e) => setFilterSource(e.target.value as 'all' | 'google' | 'website')}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                      >
                        <option value="all">All Sources ({totalReviews})</option>
                        <option value="google">Google ({googleReviews})</option>
                        <option value="website">Website ({websiteReviews})</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href="/write-review"
                      className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                      <span>Write a Review</span>
                    </a>
                    <a
                      href="https://g.page/r/CWuTntJqt_2REBM/review"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                      <span>Google</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{review.author_name}</h3>
                          
                          {/* Source Badges */}
                          {review.source === 'google' && review.local_guide && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              Google Local Guide
                            </span>
                          )}
                          {review.source === 'google' && !review.local_guide && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Google Review
                            </span>
                          )}
                          {review.source === 'website' && review.verified && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        
                        {/* Review Stats (for Google reviews) */}
                        {review.source === 'google' && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                            {review.review_count !== undefined && review.review_count > 0 && (
                              <span>{review.review_count} reviews</span>
                            )}
                            {review.photo_count !== undefined && review.photo_count > 0 && (
                              <>
                                <span>•</span>
                                <span>{review.photo_count} photos</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Product Name (for website reviews) */}
                        {review.source === 'website' && review.product_name && (
                          <div className="text-sm text-gray-500 mb-3">
                            Product: {review.product_name}
                          </div>
                        )}

                        <div className="flex items-center space-x-3 mb-3">
                          {renderStars(review.rating, 18)}
                          <span className="flex items-center text-gray-500 text-sm">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(review.review_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Title (website reviews only) */}
                    {review.review_title && (
                      <h4 className="font-semibold text-gray-900 mb-2">{review.review_title}</h4>
                    )}
                    
                    {/* Review Text */}
                    {review.review_text && review.review_text.trim() !== '' ? (
                      <p className="text-gray-700 leading-relaxed mb-4">{review.review_text}</p>
                    ) : (
                      <p className="text-gray-400 italic leading-relaxed mb-4">
                        {review.author_name} gave {review.rating} stars but didn't leave a written review
                      </p>
                    )}
                    
                    {/* Owner Response */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 italic">
                        Owner response: Thank you for your review!
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-8 text-center mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Love Your Wooden Toy?
                </h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Share your experience and help other Kiwi families discover the quality 
                  and craftsmanship of Poppa's Wooden Creations. Every review helps us grow!
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/write-review"
                    className="inline-flex items-center bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors text-lg font-semibold"
                  >
                    Write a Review
                  </a>
                  <a
                    href="https://g.page/r/CWuTntJqt_2REBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  >
                    Leave a Review on Google
                    <ExternalLink size={20} className="ml-2" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Reviews;
