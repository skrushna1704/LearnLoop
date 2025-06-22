'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout';

export default function HeaderConditional() {
  const pathname = usePathname();
  const isDashboard = /^\/(dashboard|skills|browse-skills|exchanges|messages|community|settings|profile)(\/|$)/.test(pathname);
  return !isDashboard ? <Header /> : null;
} 