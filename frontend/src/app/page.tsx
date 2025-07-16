// src/app/page.tsx
'use client'
import React from 'react';
import { Footer } from '@/components/layout';
import { Hero } from '@/components/home/Hero';
import  Stats  from '@/components/home/Stats';
import { Features } from '@/components/home/Features';
import CTA  from '@/components/home/CTA';
import { features} from '@/data/mockdata';
import { FeaturedSkillsSection } from '@/components/home/FeaturedSkillsSection';

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Hero />
      <Stats/>
      <Features features={features} />
      <FeaturedSkillsSection />
      <CTA />
      <Footer />
    </div>
  );
}