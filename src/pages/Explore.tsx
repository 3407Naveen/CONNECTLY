import { useEffect, useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Moment, MoodType } from '../types';
import MomentCard from '../components/moments/MomentCard';

interface ExploreProps {
  onNavigate: (page: string, params?: { momentId?: string }) => void;
  initialMood?: string;
}

const Explore = ({ onNavigate, initialMood }: ExploreProps) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    mood: initialMood || '',
    minPrice: '',
    maxPrice: '',
    location: '',
    duration: '',
    accessibility: false,
  });

  useEffect(() => {
    loadMoments();
  }, [filters]);

  const loadMoments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('moments')
        .select(`
          *,
          host:profiles(*)
        `)
        .eq('status', 'approved');

      if (filters.mood) {
        query = query.eq('mood', filters.mood);
      }

      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.duration) {
        const [min, max] = filters.duration.split('-').map(Number);
        query = query.gte('duration_minutes', min);
        if (max) {
          query = query.lte('duration_minutes', max);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setMoments(data as unknown as Moment[]);
    } catch (error) {
      console.error('Error loading moments:', error);
    } finally {
      setLoading(false);
    }
  };

  const moods: { label: string; value: MoodType }[] = [
    { label: 'Peaceful', value: 'peaceful' },
    { label: 'Adventurous', value: 'adventurous' },
    { label: 'Creative', value: 'creative' },
    { label: 'Romantic', value: 'romantic' },
    { label: 'Inspiring', value: 'inspiring' },
    { label: 'Playful', value: 'playful' },
  ];

  const clearFilters = () => {
    setFilters({
      mood: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      duration: '',
      accessibility: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Explore Moments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {moments.length} experiences found
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-md transition-all"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`${
              showFilters ? 'block' : 'hidden lg:block'
            } lg:w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Mood
                </label>
                <div className="space-y-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setFilters({ ...filters, mood: filters.mood === mood.value ? '' : mood.value })}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                        filters.mood === mood.value
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Price Range
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Duration
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Any duration</option>
                  <option value="0-30">Under 30 min</option>
                  <option value="30-60">30-60 min</option>
                  <option value="60-120">1-2 hours</option>
                  <option value="120-999">2+ hours</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.accessibility}
                    onChange={(e) => setFilters({ ...filters, accessibility: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Accessibility features
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full mt-6 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg"
            >
              Show Results
            </button>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : moments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moments.map((moment) => (
                  <MomentCard
                    key={moment.id}
                    moment={moment}
                    onClick={() => onNavigate('moment', { momentId: moment.id })}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No moments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
