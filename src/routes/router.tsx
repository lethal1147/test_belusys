import { SidebarLayout } from "@/layouts";
import { Classroom, Student } from "@/views";
import { Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route path="*" element={<Student />} />
        <Route path="/classroom" element={<Classroom />} />
      </Route>
    </Routes>
  );
}
