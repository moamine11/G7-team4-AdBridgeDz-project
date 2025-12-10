'use client';

// Import the main layout component that handles the sidebar, state, and content routing.
import AgencyDashboardLayout from './components/DashboardLayout'; // Update this path based on the actual location of DashboardLayout file

/**
 * @file: page.tsx
 * @path: app/(main)/dashboard/agency/page.tsx
 * * This is the main route file for the Agency Dashboard.
 * It simply renders the AgencyDashboardLayout, which handles fetching the 
 * agency profile, managing the active view, and applying the global dark theme 
 * structure (sidebar + main content).
 */

export default function AgencyDashboardPage() {
    return (
        <AgencyDashboardLayout />
    );
}