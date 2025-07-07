// src/components/ui/index.ts
export { Button, buttonVariants } from './Button';
export { Card, CardHeader, CardContent, CardFooter, CardTitle } from './Card';
export { Avatar } from './Avatar';
export { Input } from './Input';
export { Badge } from './Badge';
export { Modal } from './Modal';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { Textarea } from './textarea';
export { Label } from './label';

// src/components/layout/index.ts
export { default as Header } from '@/components/layout/Header';
export { default as Footer } from '@/components/layout/Footer';
export { default as Sidebar } from '@/components/layout/Sidebar';
export { default as DashboardLayout, PageLayout, CardLayout } from '@/components/layout/DashboardLayout';

// src/components/common/index.ts
export { 
  LoadingSpinner, 
  PageLoading, 
  CardSkeleton, 
  ListLoading, 
  InlineLoading, 
  ButtonLoading, 
  FullScreenLoading, 
  TableLoading, 
  ProgressLoading 
} from '@/components/common/LoadingSpinner';

// Skeleton components
export {
  Skeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  BrowseSkillsSkeleton,
  MessagesSkeleton,
  CommunitySkeleton,
  SidebarSkeleton
} from '@/components/common/Skeleton';

export { 
  default as ErrorBoundary, 
  ErrorState, 
  NetworkError, 
  NotFoundError, 
  UnauthorizedError, 
  ForbiddenError, 
  ServerError, 
  EmptyState 
} from '@/components/common/ErrorBoundary';

// src/components/index.ts (Main export file)
// UI Components
export * from '@/components/ui';

// Layout Components
export * from '@/components/layout';

// Common Components
export * from '@/components/common';

// You can also create specific feature exports like:
// export * from './features/auth';
// export * from './features/skills';
// etc.

// src/utils/index.ts
export * from '@/utils/constants';
export * from '@/utils/validation';
export * from '@/utils/formatters';

// Example usage in your pages/components:
/*
import { 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Badge,
  DashboardLayout,
  PageLoading,
  ErrorBoundary 
} from '@/components';

import { cn, formatDate } from '@/utils';
*/