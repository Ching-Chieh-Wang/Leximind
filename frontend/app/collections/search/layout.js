
import '@/styles/globals.css';
import { CollectionsProvider } from '@/context/CollectionsContext';
import { Suspense } from 'react';

const CollectionSearchLayout = ({ children }) => {
    return (
        <CollectionsProvider type='global'>
            {children}
        </CollectionsProvider>
    );
}

export default CollectionSearchLayout;