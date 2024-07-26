/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/admin',
				destination: '/admin/dashboard',
				permanent: true,
			},
			{
				source: '/login',
				destination: '/login-register/?tab=login',
				permanent: true,
			},
			{
				source: '/register',
				destination: '/login-register/?tab=register',
				permanent: true,
			},
		]
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'asset.cloudinary.com' },
			{ hostname: 'res.cloudinary.com' },
			{
				hostname: 'localhost',
			},
		],
		unoptimized: true,
	},
}

module.exports = nextConfig
