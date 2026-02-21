"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/jobs", label: "Jobs", icon: "💼" },
  { href: "/discover", label: "Discover", icon: "🔍" },
  { href: "/shortlist", label: "Shortlist", icon: "⭐" },
  { href: "/pipeline", label: "Pipeline", icon: "📋" },
  { href: "/searches", label: "Saved Searches", icon: "🔔" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

const adminItems = [
  { href: "/admin", label: "Admin", icon: "🔧" },
  { href: "/admin/sources", label: "Sources", icon: "🌐" },
  { href: "/admin/jobs", label: "Manage Jobs", icon: "📝" },
  { href: "/admin/companies", label: "Companies", icon: "🏢" },
  { href: "/admin/scrape", label: "Scrape", icon: "🔄" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <span>🎯</span>
          <span>JobSearch</span>
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-3">
            Admin
          </p>
          <ul className="space-y-1">
            {adminItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Job Search v0.1.0
        </p>
      </div>
    </aside>
  );
}
