import { SIDEBAR_MENUS } from "@/constant";
import SidebarMenu from "./sidebarMenu";

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-5 w-64 py-20 px-3 bg-gray-300">
      {SIDEBAR_MENUS.map((menu) => (
        <SidebarMenu key={menu.label} label={menu.label} path={menu.path} />
      ))}
    </nav>
  );
}
