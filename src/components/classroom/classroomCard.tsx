import { ClassroomWithStudent } from "@/types";
import { cn } from "@/utils";
import { BiPen, BiTrash } from "react-icons/bi";

type ClassroomCardPropType = {
  data: ClassroomWithStudent;
  setCurrentClass: React.Dispatch<
    React.SetStateAction<ClassroomWithStudent | null>
  >;
  currentClass: ClassroomWithStudent | null;
  onUpdate: (id: number) => void;
  onDelete: (classroomid: number) => void;
};

export default function ClassroomCard({
  data,
  currentClass,
  setCurrentClass,
  onUpdate,
  onDelete,
}: ClassroomCardPropType) {
  return (
    <div
      onClick={() => setCurrentClass(data)}
      className={cn("w-full p-3 relative cursor-pointer hover:bg-gray-200", {
        "bg-gray-300": currentClass?.classroomid === data.classroomid,
      })}
    >
      <h2 className="font-bold">ห้อง {data.classname}</h2>
      <p>ห้องเลขที่ : {data.classroomid}</p>
      <p className=" line-clamp-1">ครูประจำชั้น : {data.homeroom_teacher}</p>
      <div className="flex absolute top-3 right-3 gap-2">
        <BiPen
          onClick={() => onUpdate(data.classroomid)}
          className="text-yellow-600 hover:text-black"
          size={20}
        />
        <BiTrash
          onClick={() => onDelete(data.classroomid)}
          className="text-red-500 hover:text-black"
          size={20}
        />
      </div>
    </div>
  );
}
