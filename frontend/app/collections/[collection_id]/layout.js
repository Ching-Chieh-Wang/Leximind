import { CollectionProvider } from "@/context/collection/CollectionContext"
const CollectionLayout = ({children}) => {
  return (
    <CollectionProvider isPublic={true}>
        {children}
    </CollectionProvider>
  )
}

export default CollectionLayout