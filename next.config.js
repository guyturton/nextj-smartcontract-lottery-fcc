/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
// };
//module.exports = nextConfig

// had to use this setting instead of commented out above becasue static site would not compile using yarn next export for posting ipfs
module.exports = {
    images: {
        unoptimized: true,
    },
};
