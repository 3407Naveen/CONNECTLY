import { useEffect, useState } from 'react';
import { Star, Clock, MapPin, Users, Shield, Calendar, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Moment, Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import BookingModal from '../components/booking/BookingModal';

interface MomentDetailProps {
  momentId: string;
  onNavigate: (page: string) => void;
}

const MomentDetail = ({ momentId, onNavigate }: MomentDetailProps) => {
  const { user } = useAuth();
  const [moment, setMoment] = useState<Moment | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadMomentDetails();
    if (user) {
      checkIfSaved();
    }
  }, [momentId, user]);

  const loadMomentDetails = async () => {
    try {
      const { data: momentData } = await supabase
        .from('moments')
        .select(`
          *,
          host:profiles(*)
        `)
        .eq('id', momentId)
        .maybeSingle();

      if (momentData) {
        setMoment(momentData as unknown as Moment);
      }

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('moment_id', momentId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsData) {
        setReviews(reviewsData as unknown as Review[]);
      }
    } catch (error) {
      console.error('Error loading moment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_moments')
      .select('id')
      .eq('user_id', user.id)
      .eq('moment_id', momentId)
      .maybeSingle();
    setIsSaved(!!data);
  };

  const toggleSave = async () => {
    if (!user) return;

    try {
      if (isSaved) {
        await supabase
          .from('saved_moments')
          .delete()
          .eq('user_id', user.id)
          .eq('moment_id', momentId);
        setIsSaved(false);
      } else {
        await supabase
          .from('saved_moments')
          .insert({ user_id: user.id, moment_id: momentId });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!moment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Moment not found</h2>
          <button
            onClick={() => onNavigate('explore')}
            className="text-rose-500 hover:text-rose-600"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const images = moment.images?.length > 0
    ? moment.images
    : ['https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg?auto=compress&cs=tinysrgb&w=1200'];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-rose-500 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Explore</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative mb-6 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 h-96">
                <img
                  src={images[currentImageIndex]}
                  alt={moment.title}
                  className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:scale-110 transition-transform"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:scale-110 transition-transform"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-medium rounded-full capitalize">
                        {moment.mood}
                      </span>
                      {moment.verified && (
                        <div className="flex items-center space-x-1 text-blue-500">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {moment.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{avgRating}</span>
                        <span>({reviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-5 h-5" />
                        <span>{moment.location}</span>
                      </div>
                    </div>
                  </div>

                  {user && (
                    <button
                      onClick={toggleSave}
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-6 h-6 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-400'}`} />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{moment.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Up to {moment.max_participants} guests</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this experience</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {moment.emotional_description}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {moment.description}
                  </p>
                </div>

                {moment.included_items && moment.included_items.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What's included</h2>
                    <ul className="space-y-2">
                      {moment.included_items.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                          <span className="text-rose-500 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {moment.accessibility_features && moment.accessibility_features.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accessibility</h2>
                    <div className="flex flex-wrap gap-2">
                      {moment.accessibility_features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {moment.host && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Meet your host</h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {moment.host.full_name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {moment.host.full_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {moment.host.location || 'Host'}
                      </p>
                    </div>
                  </div>
                  {moment.host.bio && (
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {moment.host.bio}
                    </p>
                  )}
                </div>
              )}

              {reviews.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Reviews</h2>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-white">
                              {review.user?.full_name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {review.user?.full_name}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${moment.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/ person</span>
                </div>

                <button
                  onClick={() => user ? setShowBookingModal(true) : onNavigate('home')}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all mb-4"
                >
                  {user ? 'Book Now' : 'Sign in to Book'}
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                  You won't be charged yet
                </p>

                <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Flexible cancellation
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Verified host & experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      100% satisfaction guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          moment={moment}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            onNavigate('dashboard');
          }}
        />
      )}
    </>
  );
};

export default MomentDetail;
