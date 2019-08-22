"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var hasSubscriptionOperation = function (graphQlParams) {
    var queryDoc = graphql_1.parse(graphQlParams.query);
    for (var _i = 0, _a = queryDoc.definitions; _i < _a.length; _i++) {
        var definition = _a[_i];
        if (definition.kind === 'OperationDefinition') {
            var operation = definition.operation;
            if (operation === 'subscription') {
                return true;
            }
        }
    }
    return false;
};
exports.graphQLFetcher = function (subscriptionsClient, fallbackFetcher) {
    var activeSubscription = false;
    return function (graphQLParams) {
        if (subscriptionsClient && activeSubscription) {
            subscriptionsClient.unsubscribeAll();
        }
        if (subscriptionsClient && hasSubscriptionOperation(graphQLParams)) {
            activeSubscription = true;
            return subscriptionsClient.request({
                query: graphQLParams.query,
                variables: graphQLParams.variables,
            });
        }
        else {
            return fallbackFetcher(graphQLParams);
        }
    };
};
//# sourceMappingURL=fetcher.js.map