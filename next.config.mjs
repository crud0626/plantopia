/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: './dist',
  sassOptions: {
    includePaths: ['node_modules/'],
  },
};

export default nextConfig;
