import React, { useState } from 'react';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ReviewForm: React.FC = () => {
  const [formData, setFormData] = useState({
    author_name: '',
    email: '',
    rating: 5,
    review_title: '',
    review_text: '',
    product_name: '',
    order_number: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Insert review into database (will be hidden by default until you approve it)
      const { error: insertError } = await supabase
        .from('reviews')
        .insert([{
          author_name: formData.author_name,
          rating: formData.rating,
          review_title: formData.review_title,
          review_text: formData.review_text,
          product_name: formData.product_name,
          review_date: new Date().toISOString(),
          source: 'website',
          verified: formData.order_number.trim() !== '', // Verified if they provided order number
          is_visible: false, // Hidden until you approve in admin
          category: '' // You'll categorize in admin
        }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      
      // Reset form
      setFormData({
        author_name: '',
        email: '',
        rating: 5,
        review_title: '',
        review_text: '',
        product_name: '',
        order_number: ''
      });

    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError('Sorry, there was an error submitting your review. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = () => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setFormData({ ...formData, rating: star })}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            size={32}
            className={star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Review!
              </h2>
              <p className="text-gray-700 mb-6">
                Your review has been submitted and will be published after we verify it. 
                We truly appreciate you taking the time to share your experience!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
                >
                  Submit Another Review
                </button>
                <a
                  href="/reviews"
                  className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  View All Reviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Write a Review</h1>
            <p className="text-gray-600">
              Share your experience with Poppa's Wooden Creations. Your feedback helps other families!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="john@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">We'll never share your email publicly</p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              {renderStarRating()}
              <p className="text-sm text-gray-600 mt-2">
                {formData.rating === 5 && "Excellent!"}
                {formData.rating === 4 && "Very Good"}
                {formData.rating === 3 && "Good"}
                {formData.rating === 2 && "Fair"}
                {formData.rating === 1 && "Poor"}
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.review_title}
                onChange={(e) => setFormData({ ...formData, review_title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Beautiful craftsmanship!"
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                rows={6}
                minLength={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Tell us about your experience with our products..."
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 20 characters</p>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name (Optional)
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Wooden Train Set"
              />
            </div>

            {/* Order Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number (Optional)
              </label>
              <input
                type="text"
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Your order number"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide your order number to verify your purchase and get a "Verified Purchase" badge
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || formData.review_text.length < 20}
              className="w-full bg-amber-700 text-white px-6 py-4 rounded-lg hover:bg-amber-800 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting this review, you agree that it may be published on our website and marketing materials.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
