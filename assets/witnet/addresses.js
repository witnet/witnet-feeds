const { merge } = require("lodash")
module.exports = {
    ...merge(
        require("witnet-solidity/assets/witnet/addresses"),
        require("../../migrations/witnet/addresses")
    )
};
