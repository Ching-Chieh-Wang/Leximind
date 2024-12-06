import { CollectionsProvider } from "@/context/CollectionContext"
const CollectionsLayout = ({children}) => {
  return (
    <CollectionsProvider type='user'>
        {children}
    </CollectionsProvider>
  )
}

export default CollectionsLayout