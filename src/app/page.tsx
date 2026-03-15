import React from 'react';
import { Users, Plus } from 'lucide-react';

async function getEmployees() {
  // Hardcoded production URL as the primary source to avoid any 'Invalid URL' errors on the main web
  const productionHost = 'employee-management-system-navy-omega.vercel.app';
  const host = process.env.VERCEL_URL || productionHost;
  
  // Force HTTPS for any host that isn't localhost
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // Remove any existing protocol prefixes to prevent double https://
  const cleanHost = host.replace(/^https?:\/\//, '');
  const apiEndpoint = `${protocol}://${cleanHost}/api/employees`;

  try {
    const res = await fetch(apiEndpoint, {
      cache: 'no-store',
      next: { revalidate: 0 },
      // Added a slightly longer timeout for serverless wake-up
      signal: AbortSignal.timeout(8000), 
    });

    if (!res.ok) {
      console.error(`Status: ${res.status} at ${apiEndpoint}`);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch Exception:", error);
    return []; 
  }
}

export default async function HomePage() {
  const employees = await getEmployees();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6 text-xl font-bold text-indigo-600 tracking-tight">Enterprise EMS</div>
        <nav className="mt-4 px-4">
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
            <Users size={20} /> <span>Directory</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Workforce Dashboard</h2>
            <p className="text-sm text-slate-500">Live Production System</p>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
            <Plus size={18} /> <span className="font-semibold">New Employee</span>
          </button>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length > 0 ? (
                employees.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{emp.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                      <p className="text-slate-400 italic text-sm">Synchronizing with Live Python API...</p>
                    </div>
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