export const dynamic = "force-dynamic";
import { db, companies, jobs } from "@/lib/db";
import { desc, count } from "drizzle-orm";

async function getCompanies() {
  return db.select().from(companies).orderBy(desc(companies.createdAt)).limit(50);
}

async function getCompanyStats() {
  // Get unique company names from jobs (not normalized yet)
  const uniqueCompanies = await db
    .select({
      company: jobs.company,
      count: count(),
    })
    .from(jobs)
    .groupBy(jobs.company)
    .orderBy(desc(count()))
    .limit(20);

  return uniqueCompanies;
}

export default async function CompaniesPage() {
  const [normalizedCompanies, companyStats] = await Promise.all([
    getCompanies(),
    getCompanyStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Companies 🏢</h2>
          <p className="text-gray-600">
            Normalize and enrich company data.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🔄 Auto-Normalize
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            + Add Company
          </button>
        </div>
      </div>

      {/* Company Normalization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Normalized Companies</p>
          <p className="text-2xl font-bold">{normalizedCompanies.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Unique Names in Jobs</p>
          <p className="text-2xl font-bold">{companyStats.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Need Normalization</p>
          <p className="text-2xl font-bold text-yellow-600">
            {Math.max(0, companyStats.length - normalizedCompanies.length)}
          </p>
        </div>
      </div>

      {/* Company names from jobs (not normalized) */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Company Names (from jobs)</h3>
          <p className="text-sm text-gray-600">
            Click to create normalized company entry
          </p>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {companyStats.map((stat: { company: string | null; count: number }, i: number) => (
            <button
              key={i}
              className="px-3 py-1.5 border rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {stat.company}
              <span className="ml-2 text-gray-400">({stat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Normalized Companies Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Normalized Companies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Domain</th>
                <th className="text-left p-3">Industry</th>
                <th className="text-left p-3">Size</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {normalizedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{company.name}</td>
                  <td className="p-3 text-gray-500">{company.domain || "—"}</td>
                  <td className="p-3">
                    {company.industry && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                        {company.industry}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 capitalize">{company.size || "—"}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline text-sm mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {normalizedCompanies.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No normalized companies yet. Click a company name above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
