import { QueryGetAllGradeLevel } from "@/graphql/master/query";
import { GradeLevelType } from "@/types";
import { useQuery } from "@apollo/client";
import { Button, Input, Select } from "antd";
import { SetStateAction } from "react";
import { FaSearch } from "react-icons/fa";

type StudentFilterPropType = {
  filter: {
    studentid: number | null;
    textSearch: string;
    gradelevelid: number | null;
  };
  onChangeFilterHandler: (val: string | number, name: string) => void;
  onFilter: () => void;
  setModalMode: React.Dispatch<SetStateAction<null | "create" | "edit">>;
};

export default function StudentFilter({
  onFilter,
  filter,
  onChangeFilterHandler,
  setModalMode,
}: StudentFilterPropType) {
  const { loading, data } = useQuery(QueryGetAllGradeLevel);
  const gradeLevelDropdown = data?.getAllGradeLevel?.map(
    (level: GradeLevelType) => ({
      label: level.levelName,
      value: level.gradelevelid,
    })
  );

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
      <div className="w-full ">
        <label className="text-sm" htmlFor="studentidFil">
          รหัสนักเรียน
        </label>
        <Input
          onChange={(e) => onChangeFilterHandler(e.target.value, "studentid")}
          value={filter.studentid || ""}
          className="h-12"
          id="studentidFil"
          placeholder="รหัสนักเรียน"
        />
      </div>
      <div className="w-full">
        <label className="text-sm" htmlFor="textSearchFil">
          ชื่อจริง/นามสกุล
        </label>
        <Input
          onChange={(e) => onChangeFilterHandler(e.target.value, "textSearch")}
          value={filter.textSearch || ""}
          className="h-12"
          id="textSearchFil"
          placeholder="ชื่อจริง/นามสกุล"
        />
      </div>
      <div className="w-full">
        <label className="text-sm" htmlFor="gradeLevelFil">
          ชั้นเรียน
        </label>
        <Select
          onChange={(value) => onChangeFilterHandler(value, "gradelevelid")}
          value={filter.gradelevelid || ""}
          id="gradeLevelFil"
          placeholder="ชั้นเรียน"
          className="w-full h-12"
          options={loading ? [] : gradeLevelDropdown}
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
        เพิ่มนักเรียนใหม่
      </Button>
    </form>
  );
}
