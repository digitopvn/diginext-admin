/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
	transpilePackages: ["ahooks"],
	webpack: (config) => {
		config.resolve.extensionAlias = {
			".js": [".ts", ".tsx", ".js", ".cjs", ".mjs"],
		};

		config.module.rules.push({
			test: /\.cjs$/,
			use: "babel-loader",
		});

		config.resolve.fallback = { fs: false, path: false };
		return config;
	},
	eslint: {
		dirs: ["."],
	},
	poweredByHeader: false,
	trailingSlash: true,
	// The starter code load resources from `public` folder with `router.basePath` in React components.
	// So, the source code is "basePath-ready".
	// You can remove `basePath` if you don't need it.
	basePath: "",
	reactStrictMode: true,
	output: "standalone",
});
