import { expect, test } from 'vitest'

import * as requests from "../witnet/assets/requests"
import { Witnet } from "witnet-solidity"

const pfs = Witnet.RadonDictionary(Witnet.RadonRequest, requests.DeFi['price-feeds'])
Object.entries(pfs)
    .forEach(([key, request]) => {
        test(key, async () => {
            const report = await request.execDryRun()
            expect(report.includes("RadonError"), report).toBe(false)
        })
    })