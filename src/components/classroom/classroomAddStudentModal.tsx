import { apiStatus } from "@/constant";
import { ADD_STUDENT_TO_CLASSROOM } from "@/graphql/student/mutate";
import { QueryGetAllStudentDropdown } from "@/graphql/student/query";
import useStatus from "@/hooks/useStatus";
import { ClassroomWithStudent, StudentOptionType } from "@/types";
import { cn } from "@/utils";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Button, Modal, Select } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";

type ClassroomAddStudentModalPropsType = {
  onClose: () => void;
  modalMode: "add" | "create" | "edit" | null;
  currentClass: ClassroomWithStudent | null;
  refetchClassroom: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<unknown>>;
};

export default function ClassroomAddStudentModal({
  onClose,
  modalMode,
  currentClass,
  refetchClassroom,
}: ClassroomAddStudentModalPropsType) {
  const { data } = useQuery(QueryGetAllStudentDropdown);
  const [addStudentToClassroom] = useMutation(ADD_STUDENT_TO_CLASSROOM);
  const dropdown = data?.getAllStudentDropdown?.map(
    (stud: StudentOptionType) => ({
      value: stud.studentid,
      label: `${stud.prefix.prefixname} ${stud.firstname} ${stud.lastname}`,
    })
  );
  const [studentid, setStudentid] = useState<number | undefined>();
  const [error, setError] = useState(false);
  const { isPending, setStatus } = useStatus(apiStatus.IDLE);
  const onAddStudent = async () => {
    if (!studentid) {
      setError(true);
      return;
    }

    setError(false);
    setStatus(apiStatus.PENDING);
    const response = await addStudentToClassroom({
      variables: {
        studentid,
        classroomid: currentClass?.classroomid,
      },
    });
    if (response?.data?.addStudentToClassroom?.error) {
      setStatus(apiStatus.ERROR);
      await Swal.fire({
        icon: "error",
        timer: 5000,
        title: "เกิดข้อผิดพลาด!",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "success",
      title: "เพิ่มนักเรียนใหม่สำเร็จ",
      timer: 5000,
    });
    if (result.isConfirmed || result.dismiss) {
      onClose();
      refetchClassroom();
    }
  };

  return (
    <Modal
      title="เพิ่มนักเรียน"
      footer={null}
      onCancel={onClose}
      open={modalMode === "add"}
    >
      <div className="flex flex-col gap-2 mt-10">
        <label htmlFor="addStudent">นักเรียน</label>
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={studentid}
          onChange={(val) => setStudentid(val)}
          id="addStudent"
          className={cn("w-full h-12", {
            "border border-red-500 rounded-md": error && !studentid,
          })}
          options={dropdown || []}
        />
        <Button
          disabled={isPending}
          className={cn("mt-10 self-end", {
            "bg-gray-300": isPending,
          })}
          onClick={() => onAddStudent()}
        >
          {isPending ? "กำลังเพิ่ม..." : "เพิ่ม"}
        </Button>
      </div>
    </Modal>
  );
}
