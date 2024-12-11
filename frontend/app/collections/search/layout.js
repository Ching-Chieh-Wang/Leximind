
import '@/styles/globals.css';
import { CollectionsProvider } from '@/context/CollectionsContext';

const CollectionSearchLayout = ({ children }) => {
    return (
        <CollectionsProvider type='global'>
            {children}
        </CollectionsProvider>
    );
}

export default CollectionSearchLayout;