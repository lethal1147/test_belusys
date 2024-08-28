import { Button, Input } from "antd";
import { SetStateAction } from "react";
import { FaSearch } from "react-icons/fa";

type FilterType = {
  classroomid: number | null;
  classname: string;
  homeroomTeacher: string;
};

type ClassroomFilterPropsType = {
  setModalMode: React.Dispatch<
    SetStateAction<null | "create" | "add" | "edit">
  >;
  onFilter: () => Promise<void>;
  filter: FilterType;
  onChangeHandler: (val: string | number, name: keyof FilterType) => void;
};

export default function ClassroomFilter({
  onFilter,
  filter,
  onChangeHandler,
  setModalMode,
}: ClassroomFilterPropsType) {
  return (
    <form
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onFilter();
        }
      }}
      onSubmit={(e) => {
        e.preventDefault();
        onFilter();
      }}
      className="filter-container"
    >
      <div className="w-full">
        <label htmlFor="classroomidFil" className="text-sm">
          เลขที่ห้อง
        </label>
        <Input
          onChange={(e) => onChangeHandler(e.target.value, "classroomid")}
          value={filter.classroomid || ""}
          id="classroomidFil"
          className="h-12"
        />
      </div>
      <div className="w-full">
        <label htmlFor="classnameFil" className="text-sm">
          ชื่อห้อง
        </label>
        <Input
          onChange={(e) => onChangeHandler(e.target.value, "classname")}
          value={filter.classname || ""}
          id="classnameFil"
          className="h-12"
        />
      </div>
      <div className="w-full">
        <label htmlFor="homeroomTeacherFil" className="text-sm">
          ครูประจำชั้น
        </label>
        <Input
          onChange={(e) => onChangeHandler(e.target.value, "homeroomTeacher")}
          value={filter.homeroomTeacher || ""}
          id="homeroomTeacherFil"
          className="h-12"
        />
      </div>
      <Button htmlType="submit" className="size-12 group">
        <FaSearch className="text-white group-hover:text-gray-800" />
      </Button>
      <Button
        htmlType="button"
        onClick={() => setModalMode("create")}
        className="h-12 font-bold text-white "
      >
        เพิ่มห้องเรียนใหม่
      </Button>
    </form>
  );
}
