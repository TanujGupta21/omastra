import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-24 text-center', className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="font-display text-2xl font-bold text-black tracking-tight mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action && (
        typeof action.onClick === 'function' ? (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm"
          >
            {action.label}
          </button>
        ) : action.href ? (
          <Link
            to={action.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm"
          >
            {action.label}
          </Link>
        ) : action
      )}
    </div>
  );
}


