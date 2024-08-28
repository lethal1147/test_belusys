import { apiStatus } from "@/constant";
import {
  CreateNewClassroom,
  UpdateClassroom,
} from "@/graphql/classroom/mutate";
import { QueryGetOneClassroom } from "@/graphql/classroom/query";
import useStatus from "@/hooks/useStatus";
import { cn } from "@/utils";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Button, Input, Modal } from "antd";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loader from "../common/loader";

type CreateClassroomModalPropsType = {
  onClose: () => void;
  modalMode: "create" | "add" | "edit" | null;
  refetchClassroom: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<unknown>>;
  classroomid: number | null;
};

export default function CreateClassroomModal({
  onClose,
  modalMode,
  refetchClassroom,
  classroomid,
}: CreateClassroomModalPropsType) {
  const isEdit = modalMode === "edit";
  const { loading: loadingOne, refetch } = useQuery(QueryGetOneClassroom);
  const [createNewClassroom] = useMutation(CreateNewClassroom);
  const [updateClassroom] = useMutation(UpdateClassroom);
  const [classroomInfo, setClassroomInfo] = useState({
    classname: "",
    academic_year: "",
    homeroom_teacher: "",
  });
  const [validated, setValidate] = useState<
    Partial<Record<keyof typeof classroomInfo, boolean>>
  >({});
  const { isPending, setStatus } = useStatus(apiStatus.IDLE);

  const fetchClassroomData = async (id: number) => {
    const { data: result } = await refetch({ classroomid: +id });
    const classroomData = {
      classname: result.getOneClassroom.classname || "",
      academic_year: result.getOneClassroom.academic_year || "",
      homeroom_teacher: result.getOneClassroom.homeroom_teacher || "",
    };
    setClassroomInfo(classroomData);
  };

  useEffect(() => {
    if (!classroomid || !isEdit) return;
    fetchClassroomData(classroomid);
  }, [classroomid, modalMode]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setClassroomInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newError: Partial<Record<keyof typeof classroomInfo, boolean>> = {};
    Object.entries(classroomInfo).forEach(([key, value]) => {
      if (!value) {
        newError[key as keyof typeof classroomInfo] = true;
      }
    });
    setValidate(newError);
    if (Object.keys(newError).length > 0) {
      return;
    }
    const { classname, academic_year, homeroom_teacher } = classroomInfo;

    try {
      let isError = false;
      if (isEdit) {
        const response = await updateClassroom({
          variables: {
            editClassroomDto: {
              classroomid: classroomid,
              classname,
              academic_year,
              homeroom_teacher,
            },
          },
        });
        if (response?.data?.editClassroom?.error) isError = true;
      } else {
        const response = await createNewClassroom({
          variables: {
            createClassroomDto: {
              classname,
              academic_year,
              homeroom_teacher,
            },
          },
        });
        if (response?.data?.createNewClassroom?.error) isError = true;
      }

      if (isError) {
        setStatus(apiStatus.ERROR);
        await Swal.fire({
          icon: "error",
          timer: 5000,
          title: "เกิดข้อผิดพลาด!",
        });
        return;
      }

      setStatus(apiStatus.SUCCESS);
      const result = await Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ!",
        timer: 3000,
        confirmButtonText: "ปิด",
        confirmButtonColor: "#888",
      });
      if (result.isConfirmed || result.dismiss) {
        onClose();
        refetchClassroom();
      }
    } catch (err) {
      console.error(err);
      setStatus(apiStatus.ERROR);
    }
  };

  return (
    <Modal
      title={isEdit ? "แก้ไขห้องเรียน" : "เพิ่มห้องเรียน"}
      footer={null}
      onCancel={onClose}
      open={modalMode === "create" || modalMode === "edit"}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {loadingOne ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Loader />
          </div>
        ) : null}
        <div>
          <label htmlFor="classname">ห้องเรียน</label>
          <Input
            onChange={onChangeHandler}
            id="classname"
            name="classname"
            value={classroomInfo.classname}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.classname && !classroomInfo.classname,
            })}
          />
        </div>
        <div>
          <label htmlFor="academic_year">ปีการศึกษา</label>
          <Input
            onChange={onChangeHandler}
            id="academic_year"
            name="academic_year"
            value={classroomInfo.academic_year}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.academic_year && !classroomInfo.academic_year,
            })}
          />
        </div>
        <div>
          <label htmlFor="homeroom_teacher">ครูประจำชั้น</label>
          <Input
            onChange={onChangeHandler}
            id="homeroom_teacher"
            name="homeroom_teacher"
            value={classroomInfo.homeroom_teacher}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.homeroom_teacher && !classroomInfo.homeroom_teacher,
            })}
          />
        </div>

        <div className="flex justify-between">
          <Button
            disabled={isPending}
            htmlType="button"
            onClick={onClose}
            type="text"
            className="bg-gray-300 border border-gray-400"
          >
            ยกเลิก
          </Button>
          <Button
            disabled={isPending}
            className={cn("", {
              "bg-gray-300": isPending,
            })}
            htmlType="submit"
          >
            บันทึก
          </Button>
        </div>
      </form>
    </Modal>
  );
}
