import { CollectionsProvider } from "@/context/CollectionContext"
const CollectionsLayout = ({children}) => {
  return (
    <CollectionsProvider>
        {children}
    </CollectionsProvider>
  )
}

export default CollectionsLayout