import { StudentType } from "./studentType";

export type ClassroomType = {
  classroomid: number;
  classname: string;
  academic_year: string;
  homeroom_teacher: string;
};

export type ClassroomWithStudent = ClassroomType & {
  students: StudentType[];
};
