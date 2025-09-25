import { describe, expect, test } from 'vitest'

import * as sources from "../witnet/assets/sources"
import { Witnet } from "@witnet/sdk"

describe("Centralized Exchanges", () => {
    Object.entries(Witnet.Radon.retrievals.fromRadonAssets(sources.defi.tickers.cexes))
        .filter(([,ticker]) => ticker?.samples && Object.keys(ticker.samples).length > 0)
        .forEach(([key, ticker]) => {
            describe.concurrent(key, () => {
                Object.keys(ticker.samples).forEach(sample => {
                    test.concurrent(sample.toUpperCase(), async () => {
                        const request = new Witnet.Radon.RadonRequest({
                            sources: ticker.foldArgs(ticker.samples[sample]),
                        })
                        const report = await request.execDryRun()
                        expect(report.includes("RadonError"), report).toBe(false)
                    })
                })
            })
        })
})

describe("Decentralized Exchanges", () => {
    Object.entries(Witnet.Radon.retrievals.fromRadonAssets(sources.defi.tickers.dexes))
        .filter(([,ticker]) => ticker?.samples && Object.keys(ticker.samples).length > 0)
        .forEach(([key, ticker]) => {
            describe(key, () => {
                Object.keys(ticker.samples).forEach(sample => {
                    test.concurrent(sample.toUpperCase(), async () => {
                        const request = new Witnet.Radon.RadonRequest({
                            sources: ticker.foldArgs(ticker.samples[sample]),
                        })
                        const report = await request.execDryRun()
                        expect(report.includes("RadonError"), report).toBe(false)
                    })
                })
            })
        })    
})
