import { apiStatus, DEFAULT_STUDENT_INFO_STATE } from "@/constant";
import { QueryGetAllMaster } from "@/graphql/master/query";
import {
  CREATE_STUDENT_MUTATION,
  UPDATE_STUDENT_MUTATION,
} from "@/graphql/student/mutate";
import { QueryGetOneStudentById } from "@/graphql/student/query";
import useStatus from "@/hooks/useStatus";
import { ClassroomType, GenderType, GradeLevelType, PrefixType } from "@/types";
import { cn, createOptions } from "@/utils";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Button, DatePicker, Input, Modal, Select } from "antd";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import Loader from "../common/loader";
import dayjs from "dayjs";

type CreateStudentFormPropType = {
  onCloseModal: () => void;
  studentId: number | null;
  modalMode: null | "create" | "edit";
  refetchStudentList: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<unknown>>;
};

export default function CreateStudentForm({
  onCloseModal,
  studentId,
  modalMode,
  refetchStudentList,
}: CreateStudentFormPropType) {
  const isEdit = modalMode === "edit";

  const { loading, data } = useQuery(QueryGetAllMaster);
  const { loading: loadingOne, refetch } = useQuery(QueryGetOneStudentById);
  const [createStudent] = useMutation(CREATE_STUDENT_MUTATION);
  const [updateStudent] = useMutation(UPDATE_STUDENT_MUTATION);
  const { setStatus, isPending } = useStatus("IDLE");
  const [studentInfo, setStudentInfo] = useState(DEFAULT_STUDENT_INFO_STATE);
  const [validated, setValidated] = useState<
    Partial<Record<keyof typeof studentInfo, boolean>>
  >({});

  const dropdowns = useMemo(() => {
    if (loading || !data) return;
    const gender = createOptions<GenderType>(
      data.getAllGender,
      "genderid",
      "gendername"
    );
    const prefix = createOptions<PrefixType>(
      data.getAllPrefix,
      "prefixid",
      "prefixname"
    );
    const gradeLevel = createOptions<GradeLevelType>(
      data.getAllGradeLevel,
      "gradelevelid",
      "levelName"
    );
    const classroom = createOptions<ClassroomType>(
      data.getAllClassroom,
      "classroomid",
      "classname"
    );

    return {
      gender,
      prefix,
      gradeLevel,
      classroom,
    };
  }, [data]);

  const fetchStudentData = async (studentid: number) => {
    const { data: result } = await refetch({ studentid: +studentid });
    const studentData = {
      prefix: result.getOneStudent.prefix.prefixid || "",
      firstname: result.getOneStudent.firstname || "",
      lastname: result.getOneStudent.lastname || "",
      birthdate: dayjs(result.getOneStudent.birthdate) || null,
      gender: result.getOneStudent.gender.genderid || "",
      gradeLevel: result.getOneStudent.gradeLevel.gradelevelid || "",
      classroom:
        result.getOneStudent.studentClassrooms[0]?.classroom?.classroomid || "",
    };
    setStudentInfo(studentData);
  };

  useEffect(() => {
    if (!studentId || !isEdit) return;
    fetchStudentData(studentId);
  }, [studentId, modalMode]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newError: Partial<Record<keyof typeof studentInfo, boolean>> = {};
    Object.entries(studentInfo).forEach(([key, value]) => {
      if (!value) {
        newError[key as keyof typeof studentInfo] = true;
      }
    });
    setValidated(newError);
    if (Object.keys(newError).length > 0) {
      return;
    }
    const { prefix, firstname, lastname, birthdate, gender, gradeLevel } =
      studentInfo;

    try {
      setStatus(apiStatus.PENDING);
      const birthdateDateObj = birthdate ? birthdate.toDate() : new Date();

      let isError = false;
      if (isEdit) {
        const response = await updateStudent({
          variables: {
            updateStudentDto: {
              studentid: studentId,
              firstname,
              lastname,
              birthdate: birthdateDateObj,
              prefixid: +prefix,
              genderid: +gender,
              gradelevelid: +gradeLevel,
              classroomid: 1,
            },
          },
        });
        if (response?.data?.updateStudent?.error) isError = true;
      } else {
        const response = await createStudent({
          variables: {
            createStudentDto: {
              firstname,
              lastname,
              birthdate: birthdateDateObj,
              prefixid: +prefix,
              genderid: +gender,
              gradelevelid: +gradeLevel,
              classroomid: 1,
            },
          },
        });
        if (response?.data?.createStudent?.error) isError = true;
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
        onCloseModal();
        refetchStudentList();
      }
    } catch (error) {
      console.error("Error creating student:", error);
      setStatus(apiStatus.ERROR);
    }
  };

  return (
    <Modal
      footer={null}
      onCancel={onCloseModal}
      title={`${isEdit ? "แก้ไข" : "เพิ่ม"}นักเรียน`}
      open={!!modalMode}
      afterClose={() => setStudentInfo(DEFAULT_STUDENT_INFO_STATE)}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {loadingOne ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Loader />
          </div>
        ) : null}
        <div className="flex flex-col">
          <label htmlFor="prefix">คำนำหน้า</label>
          <Select
            value={studentInfo.prefix}
            onChange={(val) =>
              setStudentInfo((prev) => ({ ...prev, prefix: val }))
            }
            id="prefix"
            options={dropdowns?.prefix || []}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.prefix && !studentInfo.prefix,
            })}
          />
        </div>
        <div>
          <label htmlFor="firstname">ชื่อจริง</label>
          <Input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="ชื่อจริง"
            onChange={(e) => onChangeHandler(e)}
            value={studentInfo.firstname}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.firstname && !studentInfo.firstname,
            })}
          />
        </div>
        <div>
          <label htmlFor="lastname">นามสกุล</label>
          <Input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="นามสกุล"
            onChange={(e) => onChangeHandler(e)}
            value={studentInfo.lastname}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.lastname && !studentInfo.lastname,
            })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="birthdate">วันเกิด</label>
          <DatePicker
            id="birthdate"
            value={studentInfo.birthdate}
            onChange={(val) =>
              setStudentInfo((prev) => ({ ...prev, birthdate: val }))
            }
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.birthdate && !studentInfo.birthdate,
            })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gender">เพศ</label>
          <Select
            value={studentInfo.gender}
            onChange={(val) =>
              setStudentInfo((prev) => ({ ...prev, gender: val }))
            }
            id="gender"
            options={dropdowns?.gender || []}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.gender && !studentInfo.gender,
            })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gradeLevel">ระดับชั้น</label>
          <Select
            value={studentInfo.gradeLevel}
            onChange={(val) =>
              setStudentInfo((prev) => ({ ...prev, gradeLevel: val }))
            }
            id="gradeLevel"
            options={dropdowns?.gradeLevel || []}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.gradeLevel && !studentInfo.gradeLevel,
            })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gradeLevel">ห้องเรียน</label>
          <Select
            value={studentInfo.classroom}
            onChange={(val) =>
              setStudentInfo((prev) => ({ ...prev, classroom: val }))
            }
            id="classroom"
            options={dropdowns?.classroom || []}
            className={cn("", {
              "border border-red-500 rounded-md":
                validated?.classroom && !studentInfo.classroom,
            })}
          />
        </div>
        <div className="flex justify-between gap-5">
          <Button
            disabled={isPending}
            htmlType="button"
            onClick={onCloseModal}
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
            {isPending ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
