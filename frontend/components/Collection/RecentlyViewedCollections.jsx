import { CollectionsProvider } from "@/context/CollectionContext"
const RecentlyViewedCollections = ({ children }) => {
  return (
    <CollectionsProvider type='demo'>
      {children}
    </CollectionsProvider>
  )
}

export default RecentlyViewedCollections