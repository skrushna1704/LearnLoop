# LearnLoop Frontend

A modern Next.js application for peer-to-peer skill exchange.

## 🚀 Features

- **Unified Skeleton Loading System** - Consistent loading states across all pages
- **Real-time Messaging** - Socket.IO powered chat system
- **Skill Management** - Add, edit, and manage teaching/learning skills
- **Community Features** - Connect with other learners
- **Modern UI** - Built with Tailwind CSS and Radix UI components

## 📦 Skeleton Loading System

We've implemented a comprehensive skeleton loading system to provide better user experience during data loading. Here are the available skeleton components:

### Available Skeleton Components

```tsx
import { 
  Skeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  BrowseSkillsSkeleton,
  MessagesSkeleton,
  CommunitySkeleton,
  SidebarSkeleton
} from '@/components/common';
```

### Usage Examples

#### Dashboard Page
```tsx
import { DashboardSkeleton } from '@/components/common';

export default function DashboardPage() {
  const { profile: user, loading } = useProfile();
  
  if (loading) return <DashboardSkeleton />;
  
  return (
    // Your dashboard content
  );
}
```

#### Profile Page
```tsx
import { ProfileSkeleton } from '@/components/common';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) return <ProfileSkeleton />;
  
  return (
    // Your profile content
  );
}
```

#### Browse Skills Page
```tsx
import { BrowseSkillsSkeleton } from '@/components/common';

export default function BrowseSkillsPage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) return <BrowseSkillsSkeleton />;
  
  return (
    // Your skills content
  );
}
```

#### Messages Page
```tsx
import { MessagesSkeleton } from '@/components/common';

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) return <MessagesSkeleton />;
  
  return (
    // Your messages content
  );
}
```

#### Community Page
```tsx
import { CommunitySkeleton } from '@/components/common';

export default function CommunityPage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) return <CommunitySkeleton />;
  
  return (
    // Your community content
  );
}
```

#### Sidebar Component
```tsx
import { SidebarSkeleton } from '@/components/common';

export default function Sidebar() {
  const { profile: user, loading } = useProfile();
  
  if (loading) return <SidebarSkeleton />;
  
  return (
    // Your sidebar content
  );
}
```

### Base Skeleton Component

For custom skeleton layouts, you can use the base `Skeleton` component:

```tsx
import { Skeleton } from '@/components/common';

// Custom skeleton layout
<div className="space-y-4">
  <Skeleton className="h-8 w-64" />
  <Skeleton className="h-4 w-96" />
  <div className="grid grid-cols-3 gap-4">
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
</div>
```

## 🛠️ Development

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.local.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run dev:test` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Blue and purple gradient theme
- **Typography**: Inter font family
- **Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for smooth transitions
- **Loading States**: Skeleton components for better UX

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── common/           # Shared components (skeletons, etc.)
│   ├── layout/           # Layout components
│   ├── ui/               # UI primitives
│   └── features/         # Feature-specific components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🔧 Environment Variables

Required environment variables (see `env.local.example`):

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use skeleton components for loading states
3. Ensure TypeScript types are properly defined
4. Test your changes thoroughly
5. Update documentation as needed 