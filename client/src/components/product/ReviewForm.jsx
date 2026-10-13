import { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function ReviewForm({ productSlug, productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const targetSlug = productSlug || productId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    if (!body.trim()) return toast.error('Please write a review');
    setLoading(true);
    try {
      await reviewService.create(targetSlug, { rating, title, body, product: productId });
      toast.success('Review submitted for moderation!');
      setRating(0); setTitle(''); setBody('');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-2xl p-6 bg-white">
      <h3 className="font-display font-bold text-black text-lg">Write a Review</h3>

      {/* Star rating */}
      <div>
        <p className="text-sm text-gray-500 mb-2 font-medium">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'w-7 h-7 transition-colors',
                  star <= (hover || rating)
                    ? 'fill-black text-black'
                    : 'fill-transparent text-gray-200'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Review Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Summarize your experience"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-black">Your Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          placeholder="Tell others about your experience..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-200 resize-none hover:border-gray-400"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Submit Review
      </Button>
    </form>
  );
}


