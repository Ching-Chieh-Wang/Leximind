import Link from 'next/link';
import Image from 'next/image';
import DropdownMenu from '@/components/dropdown_menu/DropdownMenu';
import DropdownItem from '@/components/dropdown_menu/DropdownItem';
import ProfileIcon from '@/components/icons/ProfileIcon';
import CollectionIcon from '../icons/CollectionIcon';
import LogOutDropDownItem from './LogOutDropDownItem';
import Block from '../Block';
import { useSession } from 'next-auth/react';
const LoggedInComponent = () => {

      const { data: session } = useSession();

      console.log(session)

    const dropdownButton = (
            <Image
                unoptimized
                src={session.image || '/assets/images/logo.jpg'}
                width={40}
                height={40}
                className=" rounded-full cursor-pointer"
                alt="Profile"
            />

    )
    return (
        <>

            <Link
                href="/protected/collections" >
                <Block>
                    <CollectionIcon />
                    <h1 className="hidden sm:block">Collections</h1>
                </Block>
            </Link>

            <DropdownMenu button={dropdownButton}>
                <DropdownItem>
                    <div>
                        <h1 className="text-base font-semibold">{session.username}</h1>
                        <p className="text-sm text-gray-500 mt-1">{session.email}</p>
                    </div>
                </DropdownItem>
                <hr className="my-2" />
                <DropdownItem href="/protected/profile" icon={<ProfileIcon />}>Profile</DropdownItem>
                <DropdownItem href="/protected/collections" icon={<CollectionIcon className="py-2" size={45}/>}>My Collection</DropdownItem>
                <LogOutDropDownItem />
            </DropdownMenu>
        </>
    )
}

export default LoggedInComponent;