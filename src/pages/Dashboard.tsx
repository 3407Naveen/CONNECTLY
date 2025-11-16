import { useEffect, useState } from 'react';
import { BookMarked, Heart, MessageCircle, Image, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Moment, MemoryCapsule } from '../types';
import MomentCard from '../components/moments/MomentCard';

interface DashboardProps {
  onNavigate: (page: string, params?: { momentId?: string }) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'memories' | 'chats'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedMoments, setSavedMoments] = useState<Moment[]>([]);
  const [memoryCapsules, setMemoryCapsules] = useState<MemoryCapsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, activeTab]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (activeTab === 'bookings') {
        const { data } = await supabase
          .from('bookings')
          .select(`
            *,
            moment:moments(*),
            host:profiles!bookings_host_id_fkey(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setBookings(data as unknown as Booking[]);
      }

      if (activeTab === 'saved') {
        const { data } = await supabase
          .from('saved_moments')
          .select(`
            moment_id,
            moments(*, host:profiles(*))
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setSavedMoments(data.map(d => d.moments).filter(Boolean) as unknown as Moment[]);
      }

      if (activeTab === 'memories') {
        const { data } = await supabase
          .from('memory_capsules')
          .select(`
            *,
            moment:moments(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setMemoryCapsules(data as unknown as MemoryCapsule[]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Dashboard</h1>

        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <BookMarked className="w-5 h-5" />
            <span>My Bookings</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Saved Moments</span>
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'memories'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <Image className="w-5 h-5" />
            <span>Memory Capsules</span>
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Messages</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {booking.moment?.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{booking.start_time}</span>
                            </div>
                            <span>•</span>
                            <span>{booking.participants} participant{booking.participants > 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span className="font-semibold text-gray-900 dark:text-white">${booking.total_price}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onNavigate('moment', { momentId: booking.moment_id })}
                          className="px-6 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                    <BookMarked className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start exploring and book your first moment
                    </p>
                    <button
                      onClick={() => onNavigate('explore')}
                      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                      Explore Moments
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                {savedMoments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedMoments.map((moment) => (
                      <MomentCard
                        key={moment.id}
                        moment={moment}
                        onClick={() => onNavigate('moment', { momentId: moment.id })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No saved moments yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Save moments you love to book them later
                    </p>
                    <button
                      onClick={() => onNavigate('explore')}
                      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                      Explore Moments
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'memories' && (
              <div>
                {memoryCapsules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memoryCapsules.map((memory) => (
                      <div
                        key={memory.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="h-48 bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                          <Image className="w-16 h-16 text-white" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {memory.title || 'Untitled Memory'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {memory.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(memory.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                    <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No memory capsules yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create memory capsules after completing your experiences
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chats' && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Chat with hosts after booking an experience
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
