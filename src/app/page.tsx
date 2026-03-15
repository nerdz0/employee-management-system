import React from 'react';
import { Users, Briefcase, Plus } from 'lucide-react';

async function getEmployees() {
  const host = process.env.VERCEL_URL || 'employee-management-system-navy-omega.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const cleanHost = host.replace(/^https?:\/\//, '');
  const apiEndpoint = `${protocol}://${cleanHost}/api/employees`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(apiEndpoint, {
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch Exception:", error);
    return []; 
  }
}

// CRITICAL: This line MUST exist exactly like this
export default async function HomePage() {
  const employees = await getEmployees();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6 text-xl font-bold text-indigo-600">Enterprise EMS</div>
        <nav className="mt-4 px-4">
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-700 rounded-lg">
            <Users size={20} /> <span>Directory</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Workforce Dashboard</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            <Plus size={18} /> <span>New Employee</span>
          </button>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length > 0 ? (
                employees.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{emp.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                    Connecting to Python API... If this persists, check your deployment logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}