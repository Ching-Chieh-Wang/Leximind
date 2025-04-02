import { CollectionProvider } from "@/context/collection/CollectionContext"
const CollectionLayout = ({children}) => {
  return (
    <CollectionProvider isPublic={false}>
        {children}
    </CollectionProvider>
  )
}

export default CollectionLayout