/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"], // Allow Cloudinary images
      },
      images: {
        unoptimized: true, // Disable Next.js image optimization
      },
};

export default nextConfig;
