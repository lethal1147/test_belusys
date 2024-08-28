import ClassroomAddStudentModal from "@/components/classroom/classroomAddStudentModal";
import ClassroomCard from "@/components/classroom/classroomCard";
import ClassroomFilter from "@/components/classroom/classroomFilter";
import CreateClassroomModal from "@/components/classroom/createClassroomModal";
import { DeleteClassroom } from "@/graphql/classroom/mutate";
import { QueryGetAllClassroomWithStudent } from "@/graphql/classroom/query";
import { ClassroomWithStudent } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { Table, TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import Swal from "sweetalert2";

interface DataType {
  studentid: number;
  fullname: string;
  birthdate: Date;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "รหัสนักเรียน",
    dataIndex: "studentid",
    key: "studentid",
  },
  {
    title: "ชื่อ",
    dataIndex: "fullname",
    key: "fullname",
  },
  {
    title: "วันเกิด",
    dataIndex: "birthdate",
    key: "birthdate",
    render: (date) => dayjs(date).format("YYYY-MM-DD"),
  },
];

export default function Classroom() {
  const { loading, data, refetch } = useQuery(QueryGetAllClassroomWithStudent);
  const [currentClass, setCurrentClass] = useState<ClassroomWithStudent | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"add" | "create" | "edit" | null>(
    null
  );
  const [classroomid, setClassroomid] = useState<number | null>(null);
  const [deleteClassroom] = useMutation(DeleteClassroom);
  const [filter, setFilter] = useState({
    classroomid: null,
    classname: "",
    homeroomTeacher: "",
  });
  const onClose = () => {
    setModalMode(null);
  };

  useEffect(() => {
    if (loading) return;
    setCurrentClass(data?.getAllClassroomWithStudent[0]);
  }, [data]);

  const dataSource = currentClass?.students.map((stud) => ({
    studentid: stud.studentid,
    fullname: `${stud.prefix.prefixname} ${stud.firstname} ${stud.lastname}`,
    birthdate: stud.birthdate,
  }));

  const onChangeHandler = (val: string | number, name: keyof typeof filter) => {
    setFilter((prev) => ({ ...prev, [name]: val }));
  };

  const onUpdate = (id: number) => {
    setClassroomid(id);
    setModalMode("edit");
  };

  const onFilter = async () => {
    refetch({
      classroomid: filter.classroomid ? +filter.classroomid : null,
      classname: filter.classname,
      homeroomTeacher: filter.homeroomTeacher,
    });
  };

  const onDeleteClassroomHandler = async (classroomid: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `ยืนยันที่จะลบห้องเรียนเลขที่ '${classroomid}' ?`,
      cancelButtonColor: "#555",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      const deletedResult = await deleteClassroom({
        variables: { classroomid: classroomid },
      });
      if (deletedResult.data?.deleteClassroom) {
        await Swal.fire({
          icon: "success",
          title: `ลบห้องเรียนเลขที่ '${classroomid} เรียบร้อย'`,
          timer: 3000,
        }).then(() => refetch());
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <ClassroomFilter
        setModalMode={setModalMode}
        onFilter={onFilter}
        filter={filter}
        onChangeHandler={onChangeHandler}
      />
      <div className="bg-gray-300 h-full w-full overflow-y-auto p-3 rounded-md gap-5 grid grid-cols-4">
        <div className="col-span-1 h-full">
          <h2 className="font-bold text-xl">ห้องเรียน</h2>
          <div className="h-full bg-white p-2 flex flex-col gap-1">
            {data?.getAllClassroomWithStudent?.map(
              (classroom: ClassroomWithStudent) => (
                <ClassroomCard
                  onDelete={onDeleteClassroomHandler}
                  onUpdate={onUpdate}
                  currentClass={currentClass}
                  setCurrentClass={setCurrentClass}
                  data={classroom}
                />
              )
            )}
          </div>
        </div>
        <div className="col-span-3 h-full">
          <h2 className="font-bold text-xl">นักเรียน</h2>
          <div className="h-full bg-white p-2">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ position: ["none"] }}
            />
            <div className="flex justify-center mt-10">
              <div
                onClick={() => setModalMode("add")}
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer transition-all size-16 rounded-full flex justify-center items-center"
              >
                <BiPlus className="text-white" size={40} />
              </div>
            </div>
          </div>
        </div>
        <ClassroomAddStudentModal
          currentClass={currentClass}
          onClose={onClose}
          modalMode={modalMode}
          refetchClassroom={refetch}
        />
        <CreateClassroomModal
          refetchClassroom={refetch}
          onClose={onClose}
          modalMode={modalMode}
          classroomid={classroomid}
        />
      </div>
    </div>
  );
}
