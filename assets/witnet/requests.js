const { merge } = require("lodash")
module.exports = {
    ...merge(
        require("witnet-solidity/migrations/witnet/requests"),
        require("../../migrations/witnet/requests"),
    ),
};
