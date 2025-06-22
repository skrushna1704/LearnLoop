// ==================== src/components/ui/Avatar.tsx ====================
"use client"
import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/helpers';
import { User } from 'lucide-react';

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
        "3xl": "h-24 w-24"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        {src && !imageError ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-100">
            {fallback ? (
              <span className="text-sm font-medium text-neutral-600">
                {fallback}
              </span>
            ) : (
              <User className="h-1/2 w-1/2 text-neutral-400" />
            )}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };