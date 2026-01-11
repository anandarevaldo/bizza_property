'use client';

import React, { useState, useEffect } from 'react';
import Home from './User/Home/Home';
import { Project } from '@/components/Portfolio/PortfolioGrid';
import { getProjects } from '@/lib/actions/portfolio';

// Ideally getProjects should be fetched in Home (as Server Component) or page.tsx (as Server Component)
// But since Home is Client Component (hooks used), we can fetch here or inside Home.
// For now, let's keep it client-side compatible but clean up routing.

export default function BizzaPropertyApp() {
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        setPortfolioProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Home renders Navbar which now handles routing via Link so switchView is mostly unused for page navigation
  // but might be used for internal scrolling if logic exists.
  return (
    <Home 
        onProjectClick={() => {}} 
        projects={portfolioProjects} 
    />
  );
}