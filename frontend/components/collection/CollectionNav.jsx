import Link from 'next/link';
import Horizontal_Layout from "../Horizontal_Layout"
import CollctionIcon from "../icons/CollectionIcon"
import HomeIcon from "../icons/HomeIcon"
import NextIcon from "../icons/NextIcon"
import PreviousIcon from "../icons/PreviousIcon";

import { useCollection } from '@/context/collection/CollectionContext';
import { CollectionViewingType } from '@/context/collection/types/viewingType/CollectionViewingType';

const CollectionNav = () => {
    const { name, resetCollection, viewingType, viewingName } = useCollection()
    return (
        <Horizontal_Layout justify="start" spacing="space-x-1">
            {viewingType !== CollectionViewingType.BASIC &&
                <Horizontal_Layout>

                    <button onClick={resetCollection}>
                        <Horizontal_Layout spacing="space-x-2" extraStyle="text-teal-700 font-semibold hover:text-blue-500 mr-6">
                            <PreviousIcon />
                            <h1 className="text-xs ">Back</h1>
                        </Horizontal_Layout>
                    </button>
                </Horizontal_Layout>
            }

            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-6 gap-y-4 ">
                <Link href='/'>
                    <Horizontal_Layout spacing="space-x-1" extraStyle="hover:text-blue-500">
                        <HomeIcon />
                        <h1 className="text-xs">Home</h1>
                    </Horizontal_Layout>
                </Link>

                <NextIcon />

                <Link href='/protected/collections'>
                    <Horizontal_Layout spacing="space-x-1" extraStyle="hover:text-blue-500">
                        <CollctionIcon />
                        <h1 className="text-xs">My Collections</h1>
                    </Horizontal_Layout>
                </Link>

                <NextIcon />

                <button onClick={resetCollection}>
                    <Horizontal_Layout spacing="space-x-1" extraStyle="hover:text-blue-500">
                        <CollctionIcon />
                        <h1 className="text-xs">{name}</h1>
                    </Horizontal_Layout>
                </button>



                {viewingType != CollectionViewingType.BASIC &&
                    <>
                        <NextIcon />
                        <button>
                            <Horizontal_Layout spacing="space-x-1" extraStyle="hover:text-blue-500">
                                <h1 className="text-xs font-bold text-indigo-400">{viewingName}</h1>
                            </Horizontal_Layout>
                        </button>
                    </>
                }
            </div>
        </Horizontal_Layout>
    )
}

export default CollectionNav