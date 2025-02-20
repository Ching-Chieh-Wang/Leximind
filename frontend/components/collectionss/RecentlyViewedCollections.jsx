import { CollectionsProvider } from "@/context/CollectionsContext"
const RecentlyViewedCollections = ({ children }) => {
  return (
    <CollectionsProvider type='user'>
      {children}
    </CollectionsProvider>
  )
}

export default RecentlyViewedCollections