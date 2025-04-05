import { CollectionAction } from "./CollectionAction"

export const PrivateCollectionAction={
    ...CollectionAction,
    CREATE_WORD: 'create word',
    UPDATE_WORD: 'update word',
    REMOVE_WORD: 'remove word',
    CREATE_LABEL: 'create label',
    UPDATE_LABEL: 'update label',
    REMOVE_LABEL: 'remove label',
    UPDATE_MEMORIZE: 'update memorize',
    UPDATE_WORD_LABEL: 'update word label',
    START_CREATE_WORD_SESSION: 'start create word session',
    START_UPDATE_WORD_SESSION: 'start update word session',
    START_CREATE_LABEL_SESSION: 'start create label session',
    START_UPDATE_LABEL_SESSION: 'start update label session',
    CANCEL_EDIT_SESSION: 'cancel edit session',
    CREATE_WORD_SUBMIT: 'create word submit',
    UPDATE_WORD_SUBMIT: 'update word submit',
    CREATE_LABEL_SUBMIT: 'create label submit',
    UPDATE_LABEL_SUBMIT: 'update label submit',
    SET_COLLECTION_AND_VIEW_UNMEMORIZED: 'set collection and view unmemorized'
}