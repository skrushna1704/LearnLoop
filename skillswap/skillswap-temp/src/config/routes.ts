export const routes = {
  // Public Routes
  home: '/',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
  howItWorks: '/how-it-works',

  // Auth Routes
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
    setupProfile: '/setup-profile',
  },

  // Dashboard Routes
  dashboard: {
    root: '/dashboard',
    skills: '/browse-skills',
    exchanges: '/exchanges',
    messages: '/messages',
    community: '/community',
    settings: '/settings',
    profile: '/profile',
  },

  // API Routes
  api: {
    auth: {
      login: '/login',
      register: '/register',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password',
      verifyEmail: '/verify-email',
    },
    skills: {
      list: '/api/skills',
      create: '/api/skills',
      update: (id: string) => `/api/skills/${id}`,
      delete: (id: string) => `/api/skills/${id}`,
    },
    exchanges: {
      list: '/api/exchanges',
      create: '/api/exchanges',
      update: (id: string) => `/api/exchanges/${id}`,
      delete: (id: string) => `/api/exchanges/${id}`,
    },
    messages: {
      list: '/api/messages',
      send: '/api/messages',
      conversation: (id: string) => `/api/messages/${id}`,
    },
    community: {
      posts: '/api/community/posts',
      members: '/api/community/members',
      topics: '/api/community/topics',
    },
    profile: {
      get: '/api/profile',
      update: '/api/profile',
      skills: '/api/profile/skills',
      exchanges: '/api/profile/exchanges',
    },
  },
} as const;

type Routes = typeof routes;
type RoutePath = string | Record<string, string | ((...args: string[]) => string)>;

// Type for route parameters
export type RouteParams = {
  [K in keyof Routes]: Routes[K] extends RoutePath ? K : never;
}[keyof Routes];

// Helper function to generate route with parameters
export const generateRoute = <T extends RouteParams>(
  route: T,
  params: Record<string, string>
): string => {
  const path = routes[route] as unknown as string;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  );
};

// Navigation items for the dashboard sidebar
export const dashboardNavigation = [
  {
    title: 'Dashboard',
    href: routes.dashboard.root,
    icon: 'Home',
  },
  {
    title: 'Skills',
    href: routes.dashboard.skills,
    icon: 'Code',
  },
  {
    title: 'Exchanges',
    href: routes.dashboard.exchanges,
    icon: 'Exchange',
  },
  {
    title: 'Messages',
    href: routes.dashboard.messages,
    icon: 'MessageSquare',
  },
  {
    title: 'Community',
    href: routes.dashboard.community,
    icon: 'Users',
  },
  // {
  //   title: 'Settings',
  //   href: routes.dashboard.settings,
  //   icon: 'Settings',
  // },
  {
    title: 'Profile',
    href: routes.dashboard.profile,
    icon: 'User',
  },
] as const;

// Navigation items for the main header
export const mainNavigation = [
  {
    title: 'Home',
    href: routes.home,
  },
  {
    title: 'How It Works',
    href: routes.howItWorks,
  },
  {
    title: 'Pricing',
    href: routes.pricing,
  },
  {
    title: 'About',
    href: routes.about,
  },
  {
    title: 'Contact',
    href: routes.contact,
  },
] as const; 