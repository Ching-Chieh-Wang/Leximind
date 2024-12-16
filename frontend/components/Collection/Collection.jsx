'use client'
import { useEffect } from "react"
import WordComponent from "./WordComponent"
import LabelComponent from "./LabelComponent"
import WordListComponent from "./WordListComponent"
import { useParams } from "next/navigation"
import { useCollection } from "@/context/CollectionContext"
import Card from '@/components/Card'
import HorizontalLayout from "../horizontalLayout"

const CollectionComponent = () => {
    const { fetchCollection, collectionName, status } = useCollection();
    const params = useParams();
    const collection_id = params.collection_id;


    useEffect(() => {
        const fetchData = async () => {
            await fetchCollection(`/api/protected/collections/${collection_id}`);
        };
        fetchData();
    }, []);

    if (status === "loading") {
        return <div className="text-center mt-4">Loading words...</div>;
    }

    if (status === "error") {
        return <ErrorMsg>Error loading words!</ErrorMsg>
    }
    return (
        <HorizontalLayout>
            <Card type='card' extraStyle="hidden md:block"><WordListComponent /></Card>
            <Card type='card'><WordComponent /></Card>
            <Card type='card' extraStyle="hidden sm:block"><LabelComponent /></Card>
        </HorizontalLayout>
    )
}

export default CollectionComponent