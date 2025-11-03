import { CollectionsProvider } from "@/context/CollectionsContext"
const CollectionsLayout = ({children}) => {
  return (
    <CollectionsProvider type='user'>
        {children}
    </CollectionsProvider>
  )
}

export default CollectionsLayout