import { Star, Clock, MapPin, Heart } from 'lucide-react';
import { Moment } from '../../types';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MomentCardProps {
  moment: Moment;
  onClick: () => void;
}

const MomentCard = ({ moment, onClick }: MomentCardProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    setSaving(true);
    try {
      if (isSaved) {
        await supabase
          .from('saved_moments')
          .delete()
          .eq('user_id', user.id)
          .eq('moment_id', moment.id);
        setIsSaved(false);
      } else {
        await supabase
          .from('saved_moments')
          .insert({ user_id: user.id, moment_id: moment.id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving moment:', error);
    } finally {
      setSaving(false);
    }
  };

  const imageUrl = Array.isArray(moment.images) && moment.images.length > 0
    ? moment.images[0]
    : 'https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={moment.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {user && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-700 dark:text-gray-300'
              }`}
            />
          </button>
        )}

        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">
            {moment.mood}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {moment.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {moment.emotional_description || moment.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{moment.duration_minutes} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[120px]">{moment.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {moment.host && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {moment.host.full_name?.[0]?.toUpperCase() || 'H'}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {moment.avg_rating || '5.0'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${moment.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/person</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentCard;
