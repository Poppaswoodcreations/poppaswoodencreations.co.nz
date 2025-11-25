import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter, Plus } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  productId?: string;
}

interface ReviewsSectionProps {
  productId?: string;
  showAddReview?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId, showAddReview = true }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '5',
      customerName: 'Donna Bradford',
      rating: 5,
      title: 'Perfect baby gifts!',
      comment: 'I bought 2 car carriers as baby gifts and both sets of parents were so happy with the product. I loved that is was made in NZ and was really affordable. The service was fantastic.',
      date: '2025-07-29',
      verified: true,
      helpful: 18,
      productId: 'car-carrier'
    },
    {
      id: '6',
      customerName: 'Craig Howat',
      rating: 5,
      title: 'Awesome trolley, very well made',
      comment: 'Awesome trolley, very well made. The quality and craftsmanship is outstanding.',
      date: '2025-06-12',
      verified: true,
      helpful: 14,
      productId: 'trolley-blocks'
    },
    {
      id: '7',
      customerName: 'Stana Moes',
      rating: 5,
      title: 'Perfect birthday present!',
      comment: 'This is the perfect birthday present for my 2 year old who is obsessed with helicopters. I love that it\'s handmade from native timber. It came really fast in the post which I was especially thankful for as it was around Xmas/new year time!',
      date: '2025-01-13',
      verified: true,
      helpful: 22,
      productId: 'plane-helicopter'
    },
    {
      id: '8',
      customerName: 'Monika Roache',
      rating: 5,
      title: 'Amazing craftsmanship!',
      comment: 'Amazing craftsmanship, my toddler was thrilled to open this on Christmas morning and I\'m sure we\'ll have many years of enjoyment. Very fast postage too, thanks so much!',
      date: '2024-12-25',
      verified: true,
      helpful: 26,
      productId: 'plane-helicopter'
    },
    {
      id: '1',
      customerName: 'Sarah M.',
      rating: 5,
      title: 'Beautiful craftsmanship!',
      comment: 'Absolutely love this wooden train set. The quality is outstanding and my 3-year-old plays with it every day. Worth every penny!',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      productId: 'product-3'
    },
    {
      id: '2',
      customerName: 'Mike T.',
      rating: 5,
      title: 'Perfect gift',
      comment: 'Bought this as a gift for my nephew. The attention to detail is amazing and it\'s clearly built to last. Highly recommended!',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
      productId: 'product-1'
    },
    {
      id: '3',
      customerName: 'Emma L.',
      rating: 4,
      title: 'Great quality, fast shipping',
      comment: 'Really impressed with the quality of the wooden toys. Shipping was fast and packaging was excellent. My daughter loves her new kitchen set!',
      date: '2024-01-08',
      verified: true,
      helpful: 15,
      productId: 'product-9'
    },
    {
      id: '4',
      customerName: 'David R.',
      rating: 5,
      title: 'Sustainable and safe',
      comment: 'Love that these toys are made from sustainable materials. They feel safe for my baby and the craftsmanship is top-notch.',
      date: '2024-01-05',
      verified: true,
      helpful: 6,
      productId: 'product-7'
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    title: '',
    comment: ''
  });

  const filteredReviews = productId 
    ? reviews.filter(review => review.productId === productId)
    : reviews;

  const displayReviews = filterRating > 0 
    ? filteredReviews.filter(review => review.rating === filterRating)
    : filteredReviews;

  const averageRating = filteredReviews.length > 0 
    ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: filteredReviews.filter(review => review.rating === rating).length,
    percentage: filteredReviews.length > 0 
      ? (filteredReviews.filter(review => review.rating === rating).length / filteredReviews.length) * 100 
      : 0
  }));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: `review-${Date.now()}`,
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0,
      productId
    };
    setReviews([review, ...reviews]);
    setNewReview({ customerName: '', rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Customer Reviews & Testimonials</h1>
        <div className="text-center mb-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read what our customers say about Poppa's Wooden Creations. With over 150 five-star reviews, 
            we're proud to be New Zealand's most trusted wooden toy maker. See why families worldwide 
            choose our handcrafted toys for their children.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Verified Customer Reviews</h2>
            {showAddReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Write Review</span>
              </button>
            )}
          </div>

          {/* Review Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  {renderStars(Math.round(averageRating), 20)}
                  <p className="text-gray-600 text-sm mt-1">
                    Based on {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {displayReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {renderStars(review.rating)}
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                  </div>
                </div>
                
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ThumbsUp size={14} />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <MessageCircle size={14} />
                    <span className="text-sm">Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.customerName}
                      onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1"
                        >
                          <Star
                            size={24}
                            className={star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                    <input
                      type="text"
                      required
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      required
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;