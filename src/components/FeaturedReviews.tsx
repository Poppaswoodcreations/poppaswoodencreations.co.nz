import React from 'react';
import { Star, Award, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  source: 'google' | 'website';
  localGuide?: boolean;
  productName?: string;
}

const FeaturedReviews: React.FC = () => {
  const navigate = useNavigate();

  // Top 3 most impactful reviews
  const featuredReviews: FeaturedReview[] = [
    {
      id: '1',
      author: 'Kris Campbell',
      rating: 5,
      text: 'Very happy with my purchase, perfect gift for baby/children. Love that they are handcrafted in Whangarei made from wood and will endure time',
      date: '22 weeks ago',
      source: 'google',
      localGuide: false
    },
    {
      id: '2',
      author: 'Stana Moes',
      rating: 5,
      text: 'This is the perfect birthday present for my 2 year old who is obsessed with helicopters. I love that it\'s handmade from native timber. It came really fast in the post which I was especially thankful for as it was around Xmas/new year time!',
      date: '13 Jan 2025',
      source: 'website',
      productName: 'Helicopter'
    },
    {
      id: '3',
      author: 'Rob Griffin',
      rating: 5,
      text: 'Awesome hand made toys Every kid should have one',
      date: '25 Dec 2022',
      source: 'google',
      localGuide: true
    }
  ];

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Award className="text-amber-600 mr-2" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Loved by Kiwi Families
              </h2>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={24} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">5.0</span>
              <span className="text-gray-600">from 23 reviews</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See why families across New Zealand trust our handcrafted wooden toys
            </p>
          </div>

          {/* Featured Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {review.author}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  
                  {/* Badge */}
                  {review.source === 'google' && review.localGuide && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Google Local Guide
                    </span>
                  )}
                  {review.source === 'google' && !review.localGuide && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Google
                    </span>
                  )}
                  {review.source === 'website' && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed flex-1 mb-4">
                  "{review.text}"
                </p>

                {/* Product Name (if available) */}
                {review.productName && (
                  <p className="text-sm text-gray-500 italic">
                    Product: {review.productName}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/reviews')}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
            >
              Read All 23 Reviews
            </button>
            <a
              href="https://g.page/r/CWuTntJqt_2REBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-amber-700 border-2 border-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 flex items-center space-x-2"
            >
              <span>Leave a Review</span>
              <ExternalLink size={18} />
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-amber-700 mb-1">5.0★</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-amber-700 mb-1">23</div>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-amber-700 mb-1">100%</div>
              <p className="text-sm text-gray-600">Recommended</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-amber-700 mb-1">10+</div>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
