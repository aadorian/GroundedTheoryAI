import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'committed' | 'methodology' | 'muted' | 'outline';
  className?: string;
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-blue-100 text-blue-700',
  committed: 'bg-orange-100 text-orange-700',
  methodology: 'bg-purple-100 text-purple-700',
  muted: 'bg-gray-50 text-gray-500 border border-gray-200',
  outline: 'bg-white text-gray-600 border border-gray-200',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
