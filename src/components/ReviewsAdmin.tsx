import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Review {
  id: string;
  author_name: string;
  author_photo_url?: string;
  rating: number;
  review_text?: string;
  review_title?: string;
  review_date: string;
  source: string;
  is_visible: boolean;
  local_guide?: boolean;
  review_count?: number;
  photo_count?: number;
  verified?: boolean;
  category?: string;
  product_name?: string;
  created_at: string;
}

const ReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  
  // Form state
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 5,
    review_text: '',
    review_title: '',
    review_date: new Date().toISOString().split('T')[0],
    source: 'google',
    local_guide: false,
    review_count: 0,
    photo_count: 0,
    verified: false,
    category: '',
    product_name: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Get all visible reviews
      const { data: visibleData, error: visibleError } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', true)
        .order('review_date', { ascending: false });

      if (visibleError) throw visibleError;
      setReviews(visibleData || []);

      // Get pending reviews (not visible yet)
      const { data: pendingData, error: pendingError } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', false)
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingReviews(pendingData || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          ...formData,
          review_date: new Date(formData.review_date).toISOString()
        }]);

      if (error) throw error;

      // Reset form
      setFormData({
        author_name: '',
        rating: 5,
        review_text: '',
        review_title: '',
        review_date: new Date().toISOString().split('T')[0],
        source: 'google',
        local_guide: false,
        review_count: 0,
        photo_count: 0,
        verified: false,
        category: '',
        product_name: ''
      });
      
      setShowForm(false);
      fetchReviews();
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review. Check console for details.');
    }
  };

  const approveReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_visible: true })
        .eq('id', id);

      if (error) throw error;
      fetchReviews();
      alert('Review approved and published!');
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            {showForm ? 'Cancel' : '+ Add Review'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Reviews ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
        </div>

        {/* Add Review Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Text
                </label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Write the review here..."
                />
              </div>

              {/* Review Title - for website reviews */}
              {formData.source === 'website' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.review_title}
                    onChange={(e) => setFormData({...formData, review_title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Amazing quality!"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.review_date}
                    onChange={(e) => setFormData({...formData, review_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="google">Google</option>
                    <option value="website">Website</option>
                    <option value="manual">Manual Entry</option>
                  </select>
                </div>
              </div>

              {/* Google-specific fields */}
              {formData.source === 'google' && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.local_guide}
                        onChange={(e) => setFormData({...formData, local_guide: e.target.checked})}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Local Guide</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.review_count}
                      onChange={(e) => setFormData({...formData, review_count: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.photo_count}
                      onChange={(e) => setFormData({...formData, photo_count: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Website-specific fields */}
              {formData.source === 'website' && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50 rounded-lg">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.verified}
                        onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Verified Purchase</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.product_name}
                      onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Wooden Train Set"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      <option value="wooden-baby-toys">Wooden Baby Toys</option>
                      <option value="wooden-cars">Wooden Cars</option>
                      <option value="wooden-trains">Wooden Trains</option>
                      <option value="wooden-planes-helicopters">Wooden Planes & Helicopters</option>
                      <option value="wooden-kitchenware">Wooden Kitchenware</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Add Review
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {activeTab === 'pending' ? `Pending Reviews (${pendingReviews.length})` : `All Published Reviews (${reviews.length})`}
            </h2>
          </div>
          
          {activeTab === 'pending' && pendingReviews.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pending reviews. All caught up! 🎉
            </div>
          )}

          {activeTab === 'all' && reviews.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No reviews yet. Add your first review!
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="divide-y divide-gray-200">
              {pendingReviews.map((review) => (
                <div key={review.id} className="p-6 bg-yellow-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">{review.author_name}</h3>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.review_date).toLocaleDateString('en-NZ')}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                          PENDING APPROVAL
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {review.source}
                        </span>
                      </div>
                      {review.review_title && (
                        <h4 className="font-medium text-gray-900 mb-1">{review.review_title}</h4>
                      )}
                      {review.product_name && (
                        <p className="text-sm text-gray-600 mb-2">Product: {review.product_name}</p>
                      )}
                      <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => approveReview(review.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium whitespace-nowrap"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'all' && (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className={`p-6 ${!review.is_visible ? 'bg-gray-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">{review.author_name}</h3>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.review_date).toLocaleDateString('en-NZ')}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {review.source}
                        </span>
                        {!review.is_visible && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Hidden
                          </span>
                        )}
                      </div>
                      {review.review_title && (
                        <h4 className="font-medium text-gray-900 mb-1">{review.review_title}</h4>
                      )}
                      {review.product_name && (
                        <p className="text-sm text-gray-600 mb-2">Product: {review.product_name}</p>
                      )}
                      <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleVisibility(review.id, review.is_visible)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          review.is_visible 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {review.is_visible ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Tips for Managing Reviews</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Pending reviews are customer submissions waiting for your approval</li>
            <li>• Click "Approve & Publish" to make them visible on your website</li>
            <li>• Use "Hide" to temporarily remove reviews without deleting them</li>
            <li>• Add manual reviews from Google My Business using the "+ Add Review" button</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewsAdmin;
