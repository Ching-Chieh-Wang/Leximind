'use client'
import Link from 'next/link';
import Image from 'next/image';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import ProfileIcon from '@/components/icons/ProfileIcon';
import CollectionIcon from '../icons/CollectionIcon';
import LogOutDropDownItem from './LogOutDropDownItem';
const LoggedInComponent = ({user}) => {

    const dropdownButton = (
        <Image
            src={user.image || '/assets/images/logo.jpg'}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full cursor-pointer"
            alt="Profile"
        />
    )
    return (
        <>
            <Link
                href="/protected/collections"
                className="inline-flex items-center justify-center h-10 rounded-md border border-gray-400 bg-gray-100 px-4 font-medium text-slate-900 text-xs sm:text-sm md:text-base lg:text-lg gap-x-2 hover:bg-gray-300"
            >
                <CollectionIcon />
                Collections
            </Link>

            <DropdownMenu button={dropdownButton}>
                <DropdownItem>
                    <div>
                        <h1 className="text-base font-semibold">{user?.username}</h1>
                        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                    </div>
                </DropdownItem>
                <hr className="my-2" />
                <DropdownItem
                    href="/protected/profile"
                    icon={<ProfileIcon size="14" />}
                    label="Profile"
                />
                <LogOutDropDownItem/>
            </DropdownMenu>
        </>
    )
}

export default LoggedInComponent;