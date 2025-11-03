import { utils, Witnet } from "@witnet/sdk";
import { describe, it } from "vitest";

import * as requests from "../witnet/assets/requests/index.cjs";

describe("Witnet price update requests", async () => {
	await Promise.all(
		utils
			.searchRadonAssets({
				assets: requests.defi.tickers,
				type: Witnet.Radon.RadonRequest,
			})
			.map(([key, request]) => {
				it.concurrent(key, async ({ expect }) => {
					const report = await request.execDryRun();
					expect(report.includes("RadonError"), report).toBe(false);
				});
			}),
	);
});
