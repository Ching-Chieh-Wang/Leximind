import { CollectionStatus } from "./CollectionStatus";

export const PrivateCollectionStatus = {
    ...CollectionStatus,
    CREATING_WORD: 'creating word',
    CREATING_LABEL: 'creating label',
    UPDATING_WORD: 'updating word',
    UPDATING_LABEL: 'updating label',
    CREATE_WORD_SUBMIT: 'create word submit',
    CREATE_LABEL_SUBMIT: 'create label submit',
    UPDATE_WORD_SUBMIT: 'update word submit',
    UPDATE_LABEL_SUBMIT: 'update label submit'
};
