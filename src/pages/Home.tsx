import { useEffect, useState } from 'react';
import { Search, Star, Clock, MapPin, Sparkles, Heart, Compass, Palette, Mountain, Lightbulb, Smile } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Moment, Profile } from '../types';
import MomentCard from '../components/moments/MomentCard';

interface HomeProps {
  onNavigate: (page: string, params?: { momentId?: string; mood?: string }) => void;
}

const Home = ({ onNavigate }: HomeProps) => {
  const [featuredMoments, setFeaturedMoments] = useState<Moment[]>([]);
  const [trendingHosts, setTrendingHosts] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: moments } = await supabase
        .from('moments')
        .select(`
          *,
          host:profiles(*)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (moments) {
        setFeaturedMoments(moments as unknown as Moment[]);
      }

      const { data: hosts } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'host')
        .limit(4);

      if (hosts) {
        setTrendingHosts(hosts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const moods = [
    { name: 'Peaceful', icon: Heart, color: 'from-blue-400 to-cyan-400', value: 'peaceful' },
    { name: 'Adventurous', icon: Mountain, color: 'from-orange-400 to-red-400', value: 'adventurous' },
    { name: 'Creative', icon: Palette, color: 'from-pink-400 to-purple-400', value: 'creative' },
    { name: 'Romantic', icon: Sparkles, color: 'from-rose-400 to-pink-400', value: 'romantic' },
    { name: 'Inspiring', icon: Lightbulb, color: 'from-yellow-400 to-orange-400', value: 'inspiring' },
    { name: 'Playful', icon: Smile, color: 'from-green-400 to-teal-400', value: 'playful' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-orange-500/20 to-pink-500/20 dark:from-rose-900/30 dark:via-orange-900/30 dark:to-pink-900/30" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />

        <div className="relative h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent">
              From vacations to moments
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Discover and book short, meaningful micro-experiences that create lasting memories
            </p>

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="What kind of moment are you looking for?"
                  className="flex-1 py-4 px-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onNavigate('explore');
                    }
                  }}
                />
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Choose Your Mood
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Find experiences that match how you want to feel
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => onNavigate('explore', { mood: mood.value })}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${mood.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    {mood.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Moments
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Handpicked experiences that create lasting memories
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="hidden md:flex items-center space-x-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              <span>View All</span>
              <Compass className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMoments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  moment={moment}
                  onClick={() => onNavigate('moment', { momentId: moment.id })}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Trending Hosts
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Meet the creators of unforgettable moments
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingHosts.map((host) => (
              <div
                key={host.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {host.full_name?.[0]?.toUpperCase() || 'H'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {host.full_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3 line-clamp-2">
                  {host.bio || 'Creating meaningful moments'}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{host.location || 'Global'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-12 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Become a Host
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Share your passion and create meaningful moments for others. Start hosting today and turn your unique skills into unforgettable experiences.
          </p>
          <button className="px-8 py-4 bg-white text-rose-500 font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105">
            Start Hosting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
