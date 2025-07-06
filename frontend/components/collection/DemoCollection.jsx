'use client'
import React, { useEffect } from 'react'
import WordComponent from './word/WordComponent'
import { useCollection } from '@/context/collection/CollectionContext'
import { CollectionSchema } from '@/types/collection/collection';
import { OriginalWordsSchema, WordSchema, WordsSchema } from '@/types/word/word';
import { LabelsSchema } from '@/types/label/label';
import Card from '../Card';
import Horizontal_Layout from '../Horizontal_Layout';
import LabelComponent from './label/LabelComponent';

const labels = LabelsSchema.parse({
    1: { id: 1, name: "Fruit", color: "red" },
    2: { id: 2, name: "Yellow", color: "yellow" },
    3: { id: 3, name: "Green", color: "green" },
});


const words = OriginalWordsSchema.parse({
    1: WordSchema.parse({
        id: 1,
        name: "Apple",
        description: "A fruit that is red or green.",
        img_path: "https://example.com/apple.jpg",
        label_ids: new Set([1, 2]),
    }),
    2: WordSchema.parse({
        id: 2,
        name: "Banana",
        description: "A long yellow fruit.",
        img_path: "https://example.com/banana.jpg",
        label_ids: new Set([2]),
    }),
    3: WordSchema.parse({
        id: 3,
        name: "Grapes",
        description: "A bunch of small green or purple fruits.",
        img_path: "https://example.com/grapes.jpg",
        label_ids: new Set([1, 3]),
    }),
    4: WordSchema.parse({
        id: 4,
        name: "Orange",
        description: "A round orange fruit.",
        img_path: "https://example.com/orange.jpg",
        label_ids: new Set([1]),
    }),
    5: WordSchema.parse({
        id: 5,
        name: "Lemon",
        description: "A sour yellow fruit.",
        img_path: "https://example.com/lemon.jpg",
        label_ids: new Set([2, 3]),
    })
});




const DemoCollection = () => {
    const { setCollection } = useCollection();
    useEffect(() => {
        setCollection(CollectionSchema.parse({
            id: 0,
            name: "Demo Collection",
            words: WordsSchema.parse(Object.values(words)),
            labels: labels,
            originalWords: words
        }))
    }, [])
    return (
        <Horizontal_Layout >
            <Card type='page' title='Demo Collection' extraStyle='items-center w-full xl:w-3/4 '>
                <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-10">
                    <div className="col-span-2">
                        <WordComponent />
                    </div>
                    <div className="col-span-1">
                        <LabelComponent />
                    </div>
                </div>
            </Card>
        </Horizontal_Layout>


    )
}

export default DemoCollection