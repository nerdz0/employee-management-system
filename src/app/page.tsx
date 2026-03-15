import React from 'react';
import { Users, Briefcase, Clock, TrendingUp, Search, Plus } from 'lucide-react';

async function getEmployees() {
  // Use VERCEL_URL (system provided) or localhost for development
  const host = process.env.VERCEL_URL || 'localhost:3000';
  
  // Vercel environment variables don't include the protocol, so we add it
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const apiEndpoint = `${protocol}://${host}/api/employees`;

  try {
    const res = await fetch(apiEndpoint, {
      cache: 'no-store', // Always get fresh data
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} at ${apiEndpoint}`);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    // This logs to the Vercel Dashboard logs, not the browser console
    console.error("Fetch Exception:", error);
    return []; 
  }
}

export default async function HomePage() {
  const employees = await getEmployees();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Professional Enterprise Layout */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600 tracking-tight underline decoration-indigo-200 decoration-2 underline-offset-4">
            Enterprise EMS
          </h1>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium shadow-sm">
            <Users size={20} /> <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Briefcase size={20} /> <span>Departments</span>
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Workforce Directory</h2>
            <div className="flex items-center mt-1">
               <div className={`w-2 h-2 rounded-full mr-2 ${employees.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
               <p className="text-slate-500 text-sm">
                 System Status: 
                 <span className={employees.length > 0 ? 'text-emerald-600 font-medium ml-1' : 'text-rose-600 font-medium ml-1'}>
                   {employees.length > 0 ? 'Connected to Python API' : 'API Connection Failed'}
                 </span>
               </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200">
            <Plus size={18} /> <span>Add Employee</span>
          </button>
        </header>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee Name</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length > 0 ? (
                employees.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-100 group-hover:scale-110 transition-transform">
                        {emp.name ? emp.name.split(' ').map((n: string) => n[0]).join('') : '??'}
                      </div>
                      <span className="font-semibold text-slate-700">{emp.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{emp.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm italic">{emp.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-slate-50 rounded-full text-slate-300">
                        <Users size={40} />
                      </div>
                      <p className="text-slate-400 text-sm italic">
                        No employee records found. Check Vercel logs for "Fetch Exception".
                      </p>
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