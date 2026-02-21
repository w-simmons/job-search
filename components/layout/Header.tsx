"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/jobs": "All Jobs",
  "/discover": "Discover",
  "/shortlist": "Shortlist",
  "/pipeline": "Pipeline",
  "/searches": "Saved Searches",
  "/settings": "Settings",
  "/admin": "Admin Dashboard",
  "/admin/sources": "Job Sources",
  "/admin/jobs": "Manage Jobs",
  "/admin/companies": "Companies",
  "/admin/scrape": "Scrape Tools",
};

export function Header() {
  const pathname = usePathname();
  
  // Find the best matching title
  const title = pageTitles[pathname] || 
    Object.entries(pageTitles).find(([path]) => 
      pathname.startsWith(path) && path !== "/"
    )?.[1] || 
    "Job Search";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Quick search..."
            className="w-64 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
        
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
