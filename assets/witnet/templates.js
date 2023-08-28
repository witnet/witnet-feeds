const { merge } = require("lodash")
module.exports = {
    ...merge(
        require("witnet-solidity/migrations/witnet/templates"),
        require("../../migrations/witnet/templates"),
    ),
};
