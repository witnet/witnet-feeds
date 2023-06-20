
    const { merge } = require("lodash")
    module.exports = {
        addresses: merge(
            require("witnet-solidity/assets/witnet").addresses, 
            require("witnet-solidity-bridge/migrations/witnet.addresses"),
            require("../../migrations/witnet/addresses"),
        ),
        radons: merge(
            require("witnet-solidity/assets/witnet").radons,
            require("../../migrations/witnet/radons"),
        ),
        requests: merge(
            require("witnet-solidity/assets/witnet").requests,
            require("../../migrations/witnet/requests"),
        ),
        templates: merge(
            require("witnet-solidity/assets/witnet").templates,
            require("../../migrations/witnet/templates")
        ),
    }
    