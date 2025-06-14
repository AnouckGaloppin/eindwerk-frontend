// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://backend.ddev.site/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;

// module.exports = {
// devServer: {
//   https: {
//     key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
//   },
// },
// };

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.colruytgroup.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
