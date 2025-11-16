import { useEffect, useState } from 'react';
import { Plus, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Moment, Booking } from '../types';

const HostDashboard = () => {
  const { user } = useAuth();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHostData();
    }
  }, [user]);

  const loadHostData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: momentsData } = await supabase
        .from('moments')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (momentsData) setMoments(momentsData);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          moment:moments(*),
          user:profiles!bookings_user_id_fkey(*)
        `)
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData as unknown as Booking[]);
        const pending = bookingsData.filter(b => b.status === 'pending').length;
        const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
        const earnings = bookingsData
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + b.total_price, 0);
        setStats({ total: bookingsData.length, pending, confirmed, earnings });
      }
    } catch (error) {
      console.error('Error loading host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Host Dashboard</h1>
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            <span>Create Moment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</h3>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</h3>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</h3>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</h3>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.earnings}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Moments</h2>
            <div className="space-y-4">
              {moments.length > 0 ? (
                moments.map((moment) => (
                  <div key={moment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{moment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${moment.price} • {moment.duration_minutes} min</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(moment.status)}`}>
                      {moment.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No moments created yet</p>
                  <button className="px-6 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                    Create Your First Moment
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Bookings</h2>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{booking.moment?.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.user?.full_name} • {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">${booking.total_price}</p>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No bookings yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
