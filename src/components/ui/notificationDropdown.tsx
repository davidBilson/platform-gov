import React from 'react';
import Link from 'next/link'
import { IoCloseOutline } from "react-icons/io5";

interface NotificationDropdownProps {
    notificationsOpen: boolean;
}

const NotificationDropdown  = ({ notificationsOpen }: NotificationDropdownProps) => {

  return (
    <div className={`absolute top-15 right-0 w-68.75 p-7.5 bg-white border  border-skyblue rounded shadow-lg z-10 ${notificationsOpen ? 'block' : 'hidden'}`}>
        <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex items-start flex-col  gap-7.5">
            
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border-b border-skyblue/10 hover:bg-skyblue/10 cursor-pointer flex items-center gap-2">
                    <div>
                        <p className="text-xs text-gray-500 font-bold">This is a sample notification message</p>
                    </div>
                    <button className='cursor-pointer text-black hover:text-red-500'>
                        <IoCloseOutline />
                    </button>
                </div>
            ))}

        </div>
        <div className='pt-5 mt-7.5 border-t border-t-deepskyblue text-center'>

            <Link href="" className="text-sm text-boldblue font-bold hover:bg-skyblue/10 cursor-pointer ">
                See All Notifications
            </Link>
        </div>
    </div>
  )
}

export default NotificationDropdown