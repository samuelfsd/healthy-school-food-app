import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/sobre",
				destination: "/about",
			},
			{
				source: "/resultados",
				destination: "/result",
			},
		];
	},
};

export default nextConfig;
