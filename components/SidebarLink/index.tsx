import * as React from 'react';

interface SidebarLinkProps {
  text: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({Icon, text, active = false}) => {

  return (
    <li className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start
     text-xl space-x-3 hoverAnimation ${active && "font-bold"}`}>
      <Icon className="h-7"/>
      <span className="hidden xl:inline">{text}</span>
    </li>
  )
};

export default React.memo<SidebarLinkProps>(SidebarLink);