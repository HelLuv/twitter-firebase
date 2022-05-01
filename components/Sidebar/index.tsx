import * as React from 'react';
import Image from "next/image";

interface SidebarProps {

}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  // TODO: Sidebar
  return (
    <aside className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30}/>
      </div>

      <ul className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">

      </ul>
    </aside>
  )
};

export default React.memo<SidebarProps>(Sidebar);