import { CollectionProvider } from "@/context/CollectionContext"
const CollectionLayout = ({children}) => {
  return (
    <CollectionProvider>
        {children}
    </CollectionProvider>
  )
}

export default CollectionLayout