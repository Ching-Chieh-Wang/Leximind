const { CollectionStateSchema } = require("../state/CollectionState");


export const CollectionInitialState = CollectionStateSchema.parse({
    id: -1,
    name: '',
    labels: [],
    viewingName: '',
    viewingWordIdx: 0,
    searchQuery: null,
    error: null,
});