
import '@/styles/globals.css';
import { CollectionsProvider } from '@/context/CollectionsContext';
import { Suspense } from 'react';

const CollectionSearchLayout = ({ children }) => {
    return (
        <Suspense fallback={<div>Loading collections...</div>}>
            <CollectionsProvider type='global'>
                {children}
            </CollectionsProvider>
        </Suspense>
    );
}

export default CollectionSearchLayout;