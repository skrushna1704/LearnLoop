// src/components/common/index.ts

// Loading components
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
  } from './LoadingSpinner';

// Skeleton components
export {
  Skeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  BrowseSkillsSkeleton,
  MessagesSkeleton,
  CommunitySkeleton,
  SidebarSkeleton
} from './Skeleton';
  
  // Error handling components
  export { 
    default as ErrorBoundary, 
    ErrorState, 
    NetworkError, 
    NotFoundError, 
    UnauthorizedError, 
    ForbiddenError, 
    ServerError, 
    EmptyState 
  } from './ErrorBoundary';
  
  // Additional common components you'll create later
  // export { default as SearchBar } from './SearchBar';
  // export { default as FilterPanel } from './FilterPanel';
  // export { default as Pagination } from './Pagination';
  
  // Re-export any common types
  export type {
    // Add common component types here
  } from './ErrorBoundary';