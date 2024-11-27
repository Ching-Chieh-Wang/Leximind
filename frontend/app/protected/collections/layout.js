'use client'
const { CollectionsProvider } = require("@/context/CollectionContext");

const collectionsLayout = ({ children }) => {
    return (
        <CollectionsProvider>
            {children}
        </CollectionsProvider>
    );
}

export default collectionsLayout