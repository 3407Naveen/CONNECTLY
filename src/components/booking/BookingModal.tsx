import { useState } from 'react';
import { X, Calendar, Users, CreditCard, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Moment } from '../../types';

interface BookingModalProps {
  moment: Moment;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal = ({ moment, onClose, onSuccess }: BookingModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '10:00',
    participants: 1,
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async () => {
    if (!user || !bookingData.date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const totalPrice = moment.price * bookingData.participants;
      const endTime = `${parseInt(bookingData.time.split(':')[0]) + Math.floor(moment.duration_minutes / 60)}:${bookingData.time.split(':')[1]}`;

      const { error: bookingError } = await supabase.from('bookings').insert({
        moment_id: moment.id,
        user_id: user.id,
        host_id: moment.host_id,
        booking_date: bookingData.date,
        start_time: bookingData.time,
        end_time: endTime,
        participants: bookingData.participants,
        total_price: totalPrice,
        special_requests: bookingData.specialRequests,
        status: 'pending',
        payment_status: 'pending',
      });

      if (bookingError) throw bookingError;

      await supabase.from('notifications').insert({
        user_id: moment.host_id,
        type: 'booking',
        title: 'New Booking Request',
        content: `You have a new booking request for "${moment.title}"`,
        link: `/host-dashboard`,
      });

      setStep(3);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = moment.price * bookingData.participants;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 3 ? 'Booking Confirmed!' : 'Book Your Moment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{moment.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{moment.duration_minutes} minutes</span>
                  <span className="font-bold text-gray-900 dark:text-white">${moment.price}/person</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Time
                </label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Participants
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={bookingData.participants}
                    onChange={(e) => setBookingData({ ...bookingData, participants: parseInt(e.target.value) })}
                    min="1"
                    max={moment.max_participants}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Maximum {moment.max_participants} participants
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Any special requests or dietary requirements?"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    ${moment.price} × {bookingData.participants} participant{bookingData.participants > 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${totalPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.date}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>Date: {new Date(bookingData.date).toLocaleDateString()}</p>
                  <p>Time: {bookingData.time}</p>
                  <p>Participants: {bookingData.participants}</p>
                  <p className="font-bold text-gray-900 dark:text-white pt-2">Total: ${totalPrice}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Payment Processing Placeholder
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      In a production environment, this would integrate with Stripe or another payment processor. For now, clicking "Confirm Booking" will create a pending booking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your booking has been confirmed. You'll receive a confirmation email shortly.
              </p>
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  You can view your booking details in your dashboard
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {moment.title} on {new Date(bookingData.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
