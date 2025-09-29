import merge from "lodash.merge"

import * as _legacy from "@witnet/sdk/assets"
import * as _assets from "../../witnet/assets"

export * as utils from "./utils"
export const assets = merge(_legacy, _assets)
