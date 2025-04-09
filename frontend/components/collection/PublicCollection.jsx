'use client'
import { useEffect } from "react"
import { useParams,useSearchParams } from "next/navigation"
import WordComponent from "./word/WordComponent"
import Card from "../Card"
import CollectionNav from "./CollectionNav"
import { useCollection } from '@/context/collection/CollectionContext';
import { fetchPublicCollectionRequest } from "@/api/collection/FetchPublicCollection"
import LabelComponent from "./label/LabelComponent"

const PublicCollectionComponent = () => {
    const params = useParams();

    const {loading,setError,setCollection}= useCollection();
    const collection_id = Number(params.collection_id);

    useEffect(() => {
        const fetchData = async () => {
          loading();
          if (isNaN(collection_id)) {
            setError("Invalid collection ID");
            return;
          }
          const [collection ,error]= await fetchPublicCollectionRequest(collection_id);
          if(error) setError(error);
          else setCollection(collection);
        };
        fetchData();
      }, []);

    return (
        <>
            <div className="ml-8"><CollectionNav/></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Card type="card" extraStyle="md:col-span-2"><WordComponent /></Card>
                <Card type="card" ><LabelComponent extraStyle="col-span-1"/></Card>
            </div>
        </>
    )
}

export default PublicCollectionComponent;