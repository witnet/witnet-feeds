import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["./test/**.spec.*"],
		poolOptions: {
			vmThreads: {
				// minThreads: 4,
				// useAtomics: true,
			},
		},
		reporters: [
			// 'json',
			"default",
		],
	},
});
