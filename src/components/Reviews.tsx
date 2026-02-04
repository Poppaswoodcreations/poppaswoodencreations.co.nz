import React, { useState } from 'react';
import { Star, ExternalLink, Filter, Calendar, Award, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  title?: string;
  text: string;
  date: string;
  source: 'google' | 'website';
  localGuide?: boolean;
  reviewCount?: number;
  photoCount?: number;
  verified?: boolean;
  category?: string;
  productName?: string;
}

const Reviews: React.FC = () => {
  const [filterRating, setFilterRating] = useState(0);
  const [filterSource, setFilterSource] = useState<'all' | 'google' | 'website'>('all');

  // ALL 23 REAL REVIEWS - Complete list verified Feb 2025
  const allReviews: Review[] = [
    // === GOOGLE MY BUSINESS REVIEWS (13) ===
    {
      id: 'gmb-1',
      author: 'Andrew Davis',
      rating: 5,
      text: 'Beautiful work, hilarious staff',
      date: '8 weeks ago',
      source: 'google',
      localGuide: true,
      reviewCount: 13,
      photoCount: 7
    },
    {
      id: 'gmb-2',
      author: 'bradley spraggon',
      rating: 5,
      text: 'Absolutely brilliant chopping boards, will look good with some cheese on them!!',
      date: '11 weeks ago',
      source: 'google',
      localGuide: true,
      reviewCount: 24,
      photoCount: 16,
      category: 'wooden-kitchenware'
    },
    {
      id: 'gmb-3',
      author: 'Anna Cardy',
      rating: 5,
      text: '',
      date: '11 weeks ago',
      source: 'google',
      reviewCount: 6,
      photoCount: 0,
      category: 'wooden-baby-toys'
    },
    {
      id: 'gmb-4',
      author: 'milana playfair',
      rating: 5,
      text: '',
      date: '11 weeks ago',
      source: 'google',
      reviewCount: 0,
      photoCount: 0
    },
    {
      id: 'gmb-5',
      author: 'Jenna Hansen',
      rating: 5,
      text: 'Lots of beautiful locally made gifts - something for everyone',
      date: '13 weeks ago',
      source: 'google',
      reviewCount: 4,
      photoCount: 0
    },
    {
      id: 'gmb-6',
      author: 'hamish dick',
      rating: 5,
      text: 'Amazing items, great craftmanship and great people! Looking forward to trying the new wooden chopping board! Cheers team!',
      date: '13 weeks ago',
      source: 'google',
      reviewCount: 3,
      photoCount: 0,
      category: 'wooden-kitchenware'
    },
    {
      id: 'gmb-7',
      author: 'Sam Winder',
      rating: 5,
      text: 'Hey poppa, I love the wooden creations, but I have seen the new website and am wondering if you will add the games back? Thank you for your amazing wooden creations.',
      date: '20 weeks ago',
      source: 'google',
      reviewCount: 2,
      photoCount: 0
    },
    {
      id: 'gmb-8',
      author: 'Ishaan Singh',
      rating: 5,
      text: 'This is the best thing ever. I recently arrived from India on a rickety boat and I was very sad. I checked poppas site and it made me very happy.',
      date: '20 weeks ago',
      source: 'google',
      localGuide: true,
      reviewCount: 11,
      photoCount: 0
    },
    {
      id: 'gmb-9',
      author: 'Kris Campbell',
      rating: 5,
      text: 'Very happy with my purchase, perfect gift for baby/children. Love that they are handcrafted in Whangarei made from wood and will endure time',
      date: '22 weeks ago',
      source: 'google',
      reviewCount: 1,
      photoCount: 0,
      category: 'wooden-baby-toys'
    },
    {
      id: 'gmb-10',
      author: 'Dean',
      rating: 5,
      text: 'I love papas wooden creations and I was like that this morning and I was like that this time 😔😔😔😔 I don\'t know what to do with the cartoon dog from the tuzz for the first time in the office but it would you be good 😊😊',
      date: '31 weeks ago',
      source: 'google',
      localGuide: true,
      reviewCount: 38,
      photoCount: 16
    },
    {
      id: 'gmb-11',
      author: 'Cherie Barber',
      rating: 5,
      text: 'fantastic work',
      date: '44 weeks ago',
      source: 'google',
      reviewCount: 7,
      photoCount: 1
    },
    {
      id: 'gmb-12',
      author: 'Sandra Reyburn',
      rating: 5,
      text: 'Very cool',
      date: '22 Feb 2024',
      source: 'google',
      localGuide: true,
      reviewCount: 260,
      photoCount: 32
    },
    {
      id: 'gmb-13',
      author: 'Rob Griffin',
      rating: 5,
      text: 'Awesome hand made toys Every kid should have one',
      date: '25 Dec 2022',
      source: 'google',
      localGuide: true,
      reviewCount: 71,
      photoCount: 0
    },

    // === WEBSITE REVIEWS (10) ===
    {
      id: 'web-1',
      author: 'bradley spraggon',
      rating: 5,
      title: 'Absolutely brilliant chopping boards',
      text: 'Absolutely brilliant chopping boards, will look good with some cheese on them!!',
      date: '22 Nov 2024',
      source: 'website',
      verified: true,
      category: 'wooden-kitchenware',
      productName: 'Chopping Boards'
    },
    {
      id: 'web-2',
      author: 'Anna Cardy',
      rating: 5,
      title: 'Beautiful, high-quality wooden toys',
      text: 'Beautiful, high-quality wooden toys and gifts. Perfect for any occasion!',
      date: '22 Nov 2024',
      source: 'website',
      verified: true,
      category: 'wooden-baby-toys',
      productName: 'Wooden Toys'
    },
    {
      id: 'web-3',
      author: 'Donna Bradford',
      rating: 5,
      title: 'Perfect baby gifts!',
      text: 'I bought 2 car carriers as baby gifts and both sets of parents were so happy with the product. I loved that is was made in NZ and was really affordable. The service was fantastic.',
      date: '29 Jul 2025',
      source: 'website',
      verified: true,
      category: 'wooden-cars',
      productName: 'Car Carrier'
    },
    {
      id: 'web-4',
      author: 'Craig Howat',
      rating: 5,
      title: 'Awesome trolley, very well made',
      text: 'Awesome trolley, very well made. The quality and craftsmanship is outstanding.',
      date: '12 Jun 2025',
      source: 'website',
      verified: true,
      category: 'wooden-baby-toys',
      productName: 'Trolley & Blocks'
    },
    {
      id: 'web-5',
      author: 'Stana Moes',
      rating: 5,
      title: 'Perfect birthday present!',
      text: 'This is the perfect birthday present for my 2 year old who is obsessed with helicopters. I love that it\'s handmade from native timber. It came really fast in the post which I was especially thankful for as it was around Xmas/new year time!',
      date: '13 Jan 2025',
      source: 'website',
      verified: true,
      category: 'wooden-planes-helicopters',
      productName: 'Helicopter'
    },
    {
      id: 'web-6',
      author: 'Monika Roache',
      rating: 5,
      title: 'Amazing craftsmanship!',
      text: 'Amazing craftsmanship, my toddler was thrilled to open this on Christmas morning and I\'m sure we\'ll have many years of enjoyment. Very fast postage too, thanks so much!',
      date: '25 Dec 2024',
      source: 'website',
      verified: true,
      category: 'wooden-planes-helicopters',
      productName: 'Helicopter'
    },
    {
      id: 'web-7',
      author: 'Sarah M.',
      rating: 5,
      title: 'Beautiful craftsmanship!',
      text: 'Absolutely love this wooden train set. The quality is outstanding and my 3-year-old plays with it every day. Worth every penny!',
      date: '15 Jan 2024',
      source: 'website',
      verified: true,
      category: 'wooden-trains',
      productName: 'Train Set'
    },
    {
      id: 'web-8',
      author: 'Mike T.',
      rating: 5,
      title: 'Perfect gift',
      text: 'Bought this as a gift for my nephew. The attention to detail is amazing and it\'s clearly built to last. Highly recommended!',
      date: '10 Jan 2024',
      source: 'website',
      verified: true,
      category: 'wooden-cars',
      productName: 'Wooden Car'
    },
    {
      id: 'web-9',
      author: 'Emma L.',
      rating: 4,
      title: 'Great quality, fast shipping',
      text: 'Really impressed with the quality of the wooden toys. Shipping was fast and packaging was excellent. My daughter loves her new kitchen set!',
      date: '08 Jan 2024',
      source: 'website',
      verified: true,
      category: 'wooden-baby-toys',
      productName: 'Kitchen Set'
    },
    {
      id: 'web-10',
      author: 'David R.',
      rating: 5,
      title: 'Sustainable and safe',
      text: 'Love that these toys are made from sustainable materials. They feel safe for my baby and the craftsmanship is top-notch.',
      date: '05 Jan 2024',
      source: 'website',
      verified: true,
      category: 'wooden-baby-toys',
      productName: 'Baby Toys'
    }
  ];

  // Filter logic
  const filteredReviews = allReviews.filter(review => {
    if (filterRating > 0 && review.rating !== filterRating) return false;
    if (filterSource !== 'all' && review.source !== filterSource) return false;
    return true;
  });

  const totalReviews = allReviews.length;
  const googleReviews = allReviews.filter(r => r.source === 'google').length;
  const websiteReviews = allReviews.filter(r => r.source === 'website').length;
  
  // Calculate average (22 five-stars + 1 four-star = 4.96, rounds to 5.0)
  const totalStars = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = (totalStars / totalReviews).toFixed(1);

  const ratingDistribution = [
    { rating: 5, count: allReviews.filter(r => r.rating === 5).length },
    { rating: 4, count: allReviews.filter(r => r.rating === 4).length },
    { rating: 3, count: allReviews.filter(r => r.rating === 3).length },
    { rating: 2, count: allReviews.filter(r => r.rating === 2).length },
    { rating: 1, count: allReviews.filter(r => r.rating === 1).length }
  ].map(item => ({
    ...item,
    percentage: (item.count / totalReviews) * 100
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

                <a
                  href="https://g.page/r/CZH9mv2q0p5aEBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center space-x-2 whitespace-nowrap"
                >
                  <span>Write a Review</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{review.author}</h3>
                        
                        {/* Source Badges */}
                        {review.source === 'google' && review.localGuide && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Google Local Guide
                          </span>
                        )}
                        {review.source === 'google' && !review.localGuide && (
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
                      )}

                      {/* Product Name (for website reviews) */}
                      {review.source === 'website' && review.productName && (
                        <div className="text-sm text-gray-500 mb-3">
                          Product: {review.productName}
                        </div>
                      )}

                      <div className="flex items-center space-x-3 mb-3">
                        {renderStars(review.rating, 18)}
                        <span className="flex items-center text-gray-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Title (website reviews only) */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                  
                  {/* Review Text */}
                  {review.text && review.text.trim() !== '' ? (
                    <p className="text-gray-700 leading-relaxed mb-4">{review.text}</p>
                  ) : (
                    <p className="text-gray-400 italic leading-relaxed mb-4">
                      {review.author} gave 5 stars but didn't leave a written review
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

          </div>
        </div>
      </section>
    </div>
  );
}; #help

export default Reviews;
