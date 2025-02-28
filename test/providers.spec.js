import { describe, expect, test } from 'vitest'

import * as retrievals from "../witnet/assets/retrievals"
import { Witnet } from "witnet-solidity"

describe("Centralized Exchanges", () => {
    const cexes = Witnet.RadonDictionary(Witnet.RadonRetrieval, retrievals.tickers.cexes)
    Object.entries(cexes)
        .filter(([,ticker]) => ticker?.samples && Object.keys(ticker.samples).length > 0)
        .forEach(([key, ticker]) => {
            describe(key, () => {
                Object.keys(ticker.samples).forEach(sample => {
                    test(sample.toUpperCase(), async () => {
                        const request = new Witnet.RadonRequest({
                            retrieve: ticker.foldArgs(...ticker.samples[sample]),
                        })
                        const report = await request.execDryRun()
                        expect(report.includes("RadonError"), report).toBe(false)
                    })
                })
            })
        })    
})

describe("Decentralized Exchanges", () => {
    const dexes = Witnet.RadonDictionary(Witnet.RadonRetrieval, retrievals.tickers.dexes)
    Object.entries(dexes)
        .filter(([,ticker]) => ticker?.samples && Object.keys(ticker.samples).length > 0)
        .forEach(([key, ticker]) => {
            describe(key, () => {
                Object.keys(ticker.samples).forEach(sample => {
                    test(sample.toUpperCase(), async () => {
                        const request = new Witnet.RadonRequest({
                            retrieve: ticker.foldArgs(...ticker.samples[sample]),
                        })
                        const report = await request.execDryRun()
                        expect(report.includes("RadonError"), report).toBe(false)
                    })
                })
            })
        })    
})
