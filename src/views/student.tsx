import { TablePagination } from "@/components/common";
import Loader from "@/components/common/loader";
import { CreateStudentForm, StudentFilter } from "@/components/student";
import { DELETE_STUDENT_MUTATION } from "@/graphql/student/mutate";
import { QueryGetAllStudents } from "@/graphql/student/query";
import usePagination from "@/hooks/usePagination";
import { StudentType } from "@/types";
import { getCurrentAge } from "@/utils";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BiPen, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";

interface DataType {
  studentid: number;
  firstname: string;
  lastname: string;
  birthdate: Date;
  classroom: string;
}

export default function Student() {
  const {
    page,
    pageLimit,
    handlerNextPage,
    handlerPrevPage,
    handlerLimitChange,
    setPageSize,
  } = usePagination({ size: 0 });
  const [filter, setFilter] = useState({
    studentid: null,
    textSearch: "",
    gradelevelid: null,
  });
  const { loading, data, refetch } = useQuery(QueryGetAllStudents, {
    variables: { page, pageLimit },
  });
  const [deleteStudent] = useMutation(DELETE_STUDENT_MUTATION);
  const total = data?.getAllstudents?.total;
  const dataSource = data?.getAllstudents?.data?.map(
    (student: StudentType) => ({
      studentid: student.studentid,
      firstname: `${student?.prefix?.prefixname} ${student.firstname}`,
      lastname: student.lastname,
      birthdate: student.birthdate,
      age: student.birthdate,
      classroom: student.gradeLevel?.levelName,
    })
  );
  const [modalMode, setModalMode] = useState<"edit" | "create" | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  const onDeleteStudentHandler = async (studentid: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `ยืนยันที่จะลบนักเรียนเลขที่ '${studentid}' ?`,
      cancelButtonColor: "#555",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      const deletedResult = await deleteStudent({
        variables: { studentid: studentid },
      });
      if (deletedResult.data?.deleteStudent) {
        await Swal.fire({
          icon: "success",
          title: `ลบนักเรียนเลขที่ '${studentid} เรียบร้อย'`,
          timer: 3000,
        }).then(() => refetch());
      }
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "รหัสนักเรียน",
      dataIndex: "studentid",
      key: "studentid",
    },
    {
      title: "ชื่อจริง",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "นามสกุล",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "วันเกิด",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "อายุ",
      dataIndex: "age",
      key: "age",
      render: (date) => getCurrentAge(date),
    },
    {
      title: "ชั้นเรียน",
      dataIndex: "classroom",
      key: "classroom",
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <Button
              htmlType="button"
              onClick={() => {
                setStudentId(record.studentid);
                setModalMode("edit");
              }}
              className="bg-yellow-400"
            >
              <BiPen />
            </Button>
            <Button
              htmlType="button"
              onClick={() => onDeleteStudentHandler(record.studentid)}
              className="bg-red-500"
            >
              <BiTrash />
            </Button>
          </>
        );
      },
    },
  ];

  const onCloseModal = () => {
    setModalMode(null);
  };

  useEffect(() => {
    if (data?.getAllstudents?.total) {
      setPageSize(data?.getAllstudents?.total);
    }
  }, [data, setPageSize]);

  useEffect(() => {
    refetch();
  }, [page, pageLimit, refetch]);

  const onChangeHandler = (val: string | number, name: string) => {
    setFilter((prev) => ({ ...prev, [name]: val }));
  };

  const onFilter = async () => {
    refetch({
      studentid: filter.studentid ? +filter.studentid : null,
      textSearch: filter.textSearch,
      gradelevelid: filter.gradelevelid ? +filter.gradelevelid : null,
    });
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <StudentFilter
        onFilter={onFilter}
        filter={filter}
        onChangeFilterHandler={onChangeHandler}
        setModalMode={setModalMode}
      />
      <div className="bg-gray-300 h-full w-full p-3 rounded-md">
        {loading ? (
          <div className="size-full flex justify-center items-center grow">
            <Loader />
          </div>
        ) : (
          <>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ position: ["none"] }}
            />
            <div className="bg-white rounded-b-md py-2">
              <TablePagination
                totalDocs={total}
                page={page}
                pageLimit={pageLimit}
                handlerPageLimitChange={handlerLimitChange}
                handlerPrevPage={handlerPrevPage}
                handlerNextPage={handlerNextPage}
              />
            </div>
          </>
        )}
      </div>

      <CreateStudentForm
        modalMode={modalMode}
        studentId={studentId}
        onCloseModal={onCloseModal}
        refetchStudentList={refetch}
      />
    </div>
  );
}
