import { it } from 'vitest'

import * as requests from "../witnet/assets/requests"
import { Witnet } from "witnet-solidity"

const pfs = Witnet.RadonDictionary(Witnet.RadonRequest, requests.DeFi['price-feeds'])
// describe.concurrent('all', async () => {
//     await Promise.all(
        Object.entries(pfs)
        .map(([key, request]) => {
            it.concurrent(key, async ({ expect }) => {
                // const report = request.execDryRun()
                // expect(report.includes("RadonError"), report).toBe(false)
                await 
                request
                    .execDryRun()
                    .then(report => {
                        expect(report.includes("RadonError"), `${key} => ${report}`).toBe(false)
                    })
                    // .catch(err => {
                    //     console.error(err)    
                    // })
            })
        })
//     )
// })

