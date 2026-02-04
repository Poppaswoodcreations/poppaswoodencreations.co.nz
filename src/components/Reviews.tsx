import React, { useState } from 'react';
import { Star, ExternalLink, Filter, Calendar, Award } from 'lucide-react';

interface GMBReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  localGuide?: boolean;
  reviewCount?: number;
  photoCount?: number;
}

const Reviews: React.FC = () => {
  const [filterRating, setFilterRating] = useState(0);

  // Your actual GMB reviews (13 reviews, 4.9 average)
  const gmbReviews: GMBReview[] = [
    {
      id: '1',
      author: 'Andrew Davis',
      rating: 5,
      text: 'Beautiful work, hilarious staff',
      date: '8 weeks ago',
      localGuide: true,
      reviewCount: 13,
      photoCount: 7
    },
    {
      id: '2',
      author: 'bradley spraggon',
      rating: 5,
      text: 'Absolutely brilliant chopping boards, will look good with some cheese on them!!',
      date: '11 weeks ago',
      localGuide: true,
      reviewCount: 24,
      photoCount: 16
    },
    {
      id: '3',
      author: 'Anna Cardy',
      rating: 5,
      text: 'Beautiful, high-quality wooden toys and gifts. Perfect for any occasion!',
      date: '11 weeks ago',
      reviewCount: 6,
      photoCount: 0
    },
    {
      id: '4',
      author: 'milana playfair',
      rating: 5,
      text: 'Amazing quality and service!',
      date: '11 weeks ago',
      reviewCount: 0,
      photoCount: 0
    },
    {
      id: '5',
      author: 'Jenna Hansen',
      rating: 5,
      text: 'Lots of beautiful locally made gifts - something for everyone',
      date: '13 weeks ago',
      reviewCount: 4,
      photoCount: 0
    },
    {
      id: '6',
      author: 'hamish dick',
      rating: 5,
      text: 'Amazing items, great craftmanship and great people! Looking forward to trying the new wooden chopping board! Cheers team!',
      date: '13 weeks ago',
      reviewCount: 3,
      photoCount: 0
    },
    {
      id: '7',
      author: 'Sam Winder',
      rating: 5,
      text: 'Hey poppa, I love the wooden creations, but I have seen the new website and am wondering if you will add the games back? Thank you for your amazing wooden creations.',
      date: '20 weeks ago',
      reviewCount: 2,
      photoCount: 0
    },
    {
      id: '8',
      author: 'Ishaan Singh',
      rating: 5,
      text: 'This is the best thing ever. I recently arrived from India on a rickety boat and I was very sad. I checked poppas site and it made me very happy.',
      date: '20 weeks ago',
      localGuide: true,
      reviewCount: 11,
      photoCount: 0
    },
    {
      id: '9',
      author: 'Kris Campbell',
      rating: 5,
      text: 'Very happy with my purchase, perfect gift for baby/children. Love that they are handcrafted in Whangarei made from wood and will endure time',
      date: '22 weeks ago',
      reviewCount: 1,
      photoCount: 0
    },
    {
      id: '10',
      author: 'Dean',
      rating: 5,
      text: 'I love papas wooden creations and the quality is fantastic!',
      date: '31 weeks ago',
      localGuide: true,
      reviewCount: 38,
      photoCount: 16
    },
    {
      id: '11',
      author: 'Cherie Barber',
      rating: 5,
      text: 'fantastic work',
      date: '44 weeks ago',
      reviewCount: 7,
      photoCount: 1
    },
    {
      id: '12',
      author: 'Sandra Reyburn',
      rating: 5,
      text: 'Very cool',
      date: '22 Feb 2024',
      localGuide: true,
      reviewCount: 260,
      photoCount: 32
    },
    {
      id: '13',
      author: 'Rob Griffin',
      rating: 5,
      text: 'Awesome hand made toys Every kid should have one',
      date: '25 Dec 2022',
      localGuide: true,
      reviewCount: 71,
      photoCount: 0
    }
  ];

  const displayReviews = filterRating > 0 
    ? gmbReviews.filter(review => review.rating === filterRating)
    : gmbReviews;

  const averageRating = 4.9;
  const totalReviews = gmbReviews.length;

  const ratingDistribution = [
    { rating: 5, count: 13, percentage: 100 },
    { rating: 4, count: 0, percentage: 0 },
    { rating: 3, count: 0, percentage: 0 },
    { rating: 2, count: 0, percentage: 0 },
    { rating: 1, count: 0, percentage: 0 }
  ];

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
                <p className="text-xl opacity-90">Based on {totalReviews} Google Reviews</p>
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
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-700 mb-2">4.9★</div>
                  <p className="text-gray-600">Average Rating</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-700 mb-2">{totalReviews}</div>
                  <p className="text-gray-600">Total Reviews</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-700 mb-2">100%</div>
                  <p className="text-gray-600">5-Star Reviews</p>
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

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Filter size={20} className="text-gray-500" />
                <label htmlFor="rating-filter" className="text-sm font-medium text-gray-700">
                  Filter by rating:
                </label>
                <select
                  id="rating-filter"
                  value={filterRating}
                  onChange={(e) => setFilterRating(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                  aria-label="Filter reviews by star rating"
                >
                  <option value={0}>All Reviews ({totalReviews})</option>
                  <option value={5}>5 Stars ({ratingDistribution[0].count})</option>
                  <option value={4}>4 Stars ({ratingDistribution[1].count})</option>
                  <option value={3}>3 Stars ({ratingDistribution[2].count})</option>
                  <option value={2}>2 Stars ({ratingDistribution[3].count})</option>
                  <option value={1}>1 Star ({ratingDistribution[4].count})</option>
                </select>
              </div>
              
              <a
                href="https://g.page/r/CZH9mv2q0p5aEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center space-x-2"
              >
                <span>Write a Review</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {displayReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{review.author}</h3>
                        {review.localGuide && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Local Guide
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        {review.reviewCount !== undefined && (
                          <span>{review.reviewCount} reviews</span>
                        )}
                        {review.photoCount !== undefined && review.photoCount > 0 && (
                          <>
                            <span>•</span>
                            <span>{review.photoCount} photos</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        {renderStars(review.rating, 18)}
                        <span className="flex items-center text-gray-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  
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
              <a
                href="https://g.page/r/CZH9mv2q0p5aEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors text-lg font-semibold"
              >
                Leave a Review on Google
                <ExternalLink size={20} className="ml-2" />
              </a>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How do I leave a review?</h3>
                  <p className="text-gray-600">
                    Click the "Leave a Review on Google" button above, or visit our Google Business Profile. 
                    You'll need a Google account to leave a review.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Are all reviews verified?</h3>
                  <p className="text-gray-600">
                    Yes! All reviews shown here are from verified Google My Business reviews. 
                    We never edit or remove customer feedback.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What makes Poppa's Wooden Creations special?</h3>
                  <p className="text-gray-600">
                    Every toy is handcrafted in Whangarei from native NZ timbers (Kauri, Rimu, Macrocarpa). 
                    We focus on heirloom quality, Montessori-inspired design, and sustainable materials.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
