'use client'
import { useEffect } from "react"
import WordComponent from "./Word/WordComponent"
import LabelComponent from "./Label/LabelComponent"
import { useParams } from "next/navigation"
import { useCollection } from "@/context/CollectionContext"
import CollectionNav from "./CollectionNav"
import Card from '@/components/Card'

const CollectionComponent = () => {
    const { fetchCollection} = useCollection();
    const params = useParams();
    const collection_id = params.collection_id;


    useEffect(() => {
        const fetchData = async () => {
            await fetchCollection(`/api/protected/collections/${collection_id}`,collection_id);
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