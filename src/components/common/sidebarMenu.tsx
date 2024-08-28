import { cn } from "@/utils";
import { Link, useLocation } from "react-router-dom";

type SidebarMenuPropType = {
  label: string;
  path: string;
};

export default function SidebarMenu({ label, path }: SidebarMenuPropType) {
  const pathname = useLocation();
  const isCurrentPath = pathname.pathname;
  return (
    <Link
      className={cn("py-1.5 text-center w-full transition hover:bg-gray-400", {
        "bg-green-500 hover:bg-green-700 text-white": isCurrentPath === path,
      })}
      to={path}
    >
      {label}
    </Link>
  );
}
