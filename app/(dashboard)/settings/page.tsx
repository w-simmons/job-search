export const dynamic = "force-dynamic";
import { db, userSettings } from "@/lib/db";

async function getSettings(): Promise<Record<string, unknown>> {
  const settings = await db.select().from(userSettings);
  const result: Record<string, unknown> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return result;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Settings ⚙️</h2>
        <p className="text-gray-600">
          Configure your job search preferences.
        </p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              defaultValue={(settings.name as string) || ""}
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              defaultValue={(settings.email as string) || ""}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Job Preferences */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Job Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Target Roles</label>
            <input
              type="text"
              placeholder="e.g. Senior Engineer, Tech Lead"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Preferred Locations</label>
            <input
              type="text"
              placeholder="e.g. San Francisco, Remote"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum Salary</label>
            <input
              type="number"
              placeholder="150000"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remote" className="rounded" />
            <label htmlFor="remote" className="text-sm text-gray-600">
              Only show remote jobs
            </label>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-600">Email me new job matches</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-600">Weekly digest email</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-600">Push notifications</span>
          </label>
        </div>
      </section>

      {/* Companies */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Company Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority Companies</label>
            <input
              type="text"
              placeholder="Companies to highlight"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              These companies will be highlighted in your feed
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hidden Companies</label>
            <input
              type="text"
              placeholder="Companies to hide"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Jobs from these companies won&apos;t appear
            </p>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
