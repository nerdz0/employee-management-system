async function getEmployees() {
  // Use the system VERCEL_URL, or your actual live domain as a hardcoded fallback
  const host = process.env.VERCEL_URL || 'employee-management-system-navy-omega.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // Clean the host (sometimes VERCEL_URL includes 'https://', we need to prevent double 'https://')
  const cleanHost = host.replace(/^https?:\/\//, '');
  const apiEndpoint = `${protocol}://${cleanHost}/api/employees`;

  try {
    const res = await fetch(apiEndpoint, {
      cache: 'no-store',
      // Adding a signal to Vercel that this is a dynamic request
      next: { revalidate: 0 } 
    });

    if (!res.ok) {
      console.error(`Status: ${res.status} at ${apiEndpoint}`);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch Exception:", error);
    return []; 
  }
}