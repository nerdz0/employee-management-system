/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        // In Codespaces/Local, it looks at port 8000. On Vercel, it uses the serverless function.
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:8000/api/:path*'
          : '/api/',
      },
    ]
  },
};

export default nextConfig;