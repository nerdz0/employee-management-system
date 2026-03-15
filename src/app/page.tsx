// Inside your component, add a quick fetch
async function getEmployees() {
  const res = await fetch('http://localhost:3000/api/employees');
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const employees = await getEmployees();
  
  // ... rest of your UI ...
  // In the table body, map through the employees:
  {employees.map((emp: any) => (
    <tr key={emp.id} className="hover:bg-slate-50 transition">
       <td className="px-6 py-4 font-medium text-slate-700">{emp.name}</td>
       <td className="px-6 py-4 text-slate-600 text-sm">{emp.role}</td>
    </tr>
  ))}
}
