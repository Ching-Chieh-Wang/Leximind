"use client"
import { signOut } from 'next-auth/react';
import DropdownItem from '@/components/DropdownMenu/DropdownItem';
import LogoutIcon from '@/components/icons/LogoutIcon';

const LogOutDropDownItem = () => {
    return (
        <DropdownItem
            onClick={()=>signOut({redirect:false})}
            icon={<LogoutIcon size="14" />}
        >Logout</DropdownItem>
    )
}

export default LogOutDropDownItem