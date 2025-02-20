import { CollectionsProvider } from "@/context/CollectionsContext"
import Card from "@/components/Card"
const CollectionsLayout = ({children}) => {
  return (
    <CollectionsProvider type='user'>
        {children}
    </CollectionsProvider>
  )
}

export default CollectionsLayout