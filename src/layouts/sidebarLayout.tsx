import { Sidebar } from "@/components/common";
import { Outlet } from "react-router-dom";

export default function SidebarLayout() {
  return (
    <main className="w-screen h-screen flex">
      <Sidebar />
      <div className="p-5 w-full overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
}
