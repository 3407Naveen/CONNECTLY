import { useEffect, useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle, Users, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Moment } from '../types';

const AdminDashboard = () => {
  const [pendingMoments, setPendingMoments] = useState<Moment[]>([]);
  const [stats, setStats] = useState({ totalMoments: 0, totalUsers: 0, totalBookings: 0, pendingApprovals: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const { data: momentsData } = await supabase
        .from('moments')
        .select(`*, host:profiles(*)`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (momentsData) setPendingMoments(momentsData as unknown as Moment[]);

      const [{ count: totalMoments }, { count: totalUsers }, { count: totalBookings }] = await Promise.all([
        supabase.from('moments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalMoments: totalMoments || 0,
        totalUsers: totalUsers || 0,
        totalBookings: totalBookings || 0,
        pendingApprovals: momentsData?.length || 0,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (momentId: string, approved: boolean) => {
    try {
      await supabase
        .from('moments')
        .update({ status: approved ? 'approved' : 'rejected' })
        .eq('id', momentId);

      const moment = pendingMoments.find(m => m.id === momentId);
      if (moment) {
        await supabase.from('notifications').insert({
          user_id: moment.host_id,
          type: 'system',
          title: approved ? 'Moment Approved' : 'Moment Rejected',
          content: `Your moment "${moment.title}" has been ${approved ? 'approved' : 'rejected'}.`,
        });
      }

      loadAdminData();
    } catch (error) {
      console.error('Error updating moment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-rose-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Moments</h3>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalMoments}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</h3>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</h3>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingApprovals}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pending Moment Approvals</h2>
          <div className="space-y-4">
            {pendingMoments.length > 0 ? (
              pendingMoments.map((moment) => (
                <div key={moment.id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {moment.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {moment.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Host: {moment.host?.full_name}</span>
                        <span>•</span>
                        <span>${moment.price}</span>
                        <span>•</span>
                        <span>{moment.duration_minutes} min</span>
                        <span>•</span>
                        <span className="capitalize">{moment.mood}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproval(moment.id, true)}
                        className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleApproval(moment.id, false)}
                        className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No pending approvals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
