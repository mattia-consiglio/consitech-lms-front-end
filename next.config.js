/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'asset.cloudinary.com' },
			{ hostname: 'res.cloudinary.com' },
		],
	},
}

module.exports = nextConfig
