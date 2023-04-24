
const Witnet = require("witnet-requests");
const witnetRadonScript = () => new Witnet.Script([ Witnet.TYPES.STRING ]);
module.exports = {
    /// FORMULA 1 ////////////////////////////////////////////////////////////////////////
    /// path: { ... path: {
    ///     "request_authority": {
    ///         "unique-resource-name": {
    ///             requestMethod: Witnet.Types.RETRIEVAL_METHODS..
    ///             requestSchema: "https://",
    ///             requestPath: "request_path"
    ///             requestQuery: "(optional)",
    ///             requestScript: witnetRadonScript().parseJSON..()..<radon-operators>
    ///         },
    ///         ...
    ///     }
    /// } ... } .. },
    /// FORMULA 2 ////////////////////////////////////////////////////////////////////////
    /// path: { ... path: {
    ///     "request_authority": {
    ///         "unique_request_path": {
    ///             requestMethod: Witnet.Types.RETRIEVAL_METHODS..
    ///             requestSchema: "https://",
    ///             requestQuery: "(optional)",
    ///             requestScript: witnetRadonScript().parseJSON..()..<radon-operators>
    ///         },
    ///         ...
    ///     }
    /// } ... } .. },
    /// FORMULA 3 ////////////////////////////////////////////////////////////////////////
    /// path: { ... path: {
    ///     "unique-resource-name": {
    ///         requestMethod: Witnet.Types.RETRIEVAL_METHODS..
    ///         requestSchema: "https://",
    ///         requestAuthority: "request_authority",
    ///         requestPath: "request_path",
    ///         requestQuery: "(optional)",
    ///         requestScript: witnetRadonScript().parseJSON..()..<radon-operators>
    ///     },
    /// } ... } .. },
};
