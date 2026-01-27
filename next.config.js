/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'your-project.supabase.co', // Replace with your actual Supabase project domain
      'www.uaemartb2b.com',
    ],
  },
  // Remove local env block; use Vercel/Supabase dashboard for env vars
};

module.exports = nextConfig;
