import { CollectionsProvider } from "@/context/CollectionContext"
const RecentlyViewedCollections = ({ children }) => {
    return (
        <CollectionsProvider>{children}</CollectionsProvider>
    )
}

export default RecentlyViewedCollections