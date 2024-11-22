import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// import {withSentryConfig} from '@sentry/nextjs';
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true
//   },
//   eslint: {
//     ignoreDuringBuilds: true
//   }
// };

// export default withSentryConfig(nextConfig, {

// silent: true,
// org: "jsm-x9",
// project: "javascript-nextjs",
// }, {

// widenClientFileUpload: true,

//  transpileClientSDK: true,

//  hideSourceMaps: true,

//  disableLogger: true,

// automaticVercelMonitors: true,
// });
