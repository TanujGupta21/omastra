import { formatDate } from '../../lib/utils';
import Rating from '../ui/Rating';
import { ThumbsUp } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpfulCount || 0);
  const [voted, setVoted] = useState(false);

  const handleHelpful = async () => {
    if (voted) return;
    try {
      await reviewService.markHelpful(review._id);
      setHelpful((h) => h + 1);
      setVoted(true);
    } catch {}
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 hover:border-black transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-sm font-bold text-white">
            {review.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-black">{review.user?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <Rating value={review.rating} size="sm" />
      </div>

      {review.title && <h4 className="text-sm font-bold text-black">{review.title}</h4>}
      <p className="text-sm text-gray-500 leading-relaxed">{review.body}</p>

      {review.verifiedPurchase && (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full">
          ✓ Verified Purchase
        </span>
      )}

      <button
        onClick={handleHelpful}
        disabled={voted}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors disabled:opacity-40 font-medium"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        Helpful ({helpful})
      </button>
    </div>
  );
}


