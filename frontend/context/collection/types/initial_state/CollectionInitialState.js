import { CollectionStatus } from "../status/CollectionStatus";
import { CollectionViewingType } from "../viewingType/CollectionViewingType";

const { CollectionStateSchema } = require("../state/CollectionState");


export const CollectionInitialState = CollectionStateSchema.parse({
    id: -1,
    name: '',
    words:[],
    originalWords:{},
    labels: {},
    isFlipped: false,
    isAlwaysShowDescription: false,
    viewingName: '',
    viewingWordIdx: 0,
    searchQuery: null,
    error: null,
    status: CollectionStatus.LOADING,
    viewingType: CollectionViewingType.BASIC,
    is_public:true,
});