const { merge } = require("lodash")
module.exports = {
    ...merge(
        require("witnet-solidity/migrations/witnet/retrievals"),
        require("../../migrations/witnet/retrievals"),
    ),
};
