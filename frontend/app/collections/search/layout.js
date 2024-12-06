
import '@/styles/globals.css';
import { CollectionsProvider } from '@/context/CollectionContext';

const CollectionSearchLayout = ({ children }) => {
    return (
        <CollectionsProvider>
            {children}
        </CollectionsProvider>
    );
}

export default CollectionSearchLayout;