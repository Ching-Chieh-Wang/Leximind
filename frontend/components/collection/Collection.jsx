'use client'
import { useEffect } from "react"
import { useParams,useSearchParams } from "next/navigation"
import WordComponent from "./word/WordComponent"
import Card from "../Card"
import CollectionNav from "./CollectionNav"
import { useCollection } from '@/context/collection/CollectionContext';
import { fetchPrivateCollectionRequest } from "@/api/collection/FetchPrivateCollection"
import LabelComponent from "./label/LabelComponent"

const CollectionComponent = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const {loading,setError,setCollection, setCollectionAndViewUnmemorized}= useCollection();
    const collection_id = Number(params.collection_id);
    const isUnmemorized = searchParams.get("unmemorized") === "true";

    useEffect(() => {
        const fetchData = async () => {
          loading();
          if (isNaN(collection_id)) {
            setError("Invalid collection ID");
            return;
          }
          const [collection ,error]= await fetchPrivateCollectionRequest(collection_id);
          if(error) setError(error);
          else {
            if(isUnmemorized)setCollectionAndViewUnmemorized(collection);
            else setCollection(collection);
          }
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

export default CollectionComponent