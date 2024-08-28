import { gql } from "@apollo/client";

export const QueryGetAllClassroom = gql`
  query GetAllClassroom {
    getAllClassroom {
      classroomid
      classname
    }
  }
`;

export const QueryGetAllClassroomWithStudent = gql`
  query GetAllClassroomWithStudent(
    $classroomid: Float
    $classname: String
    $homeroomTeacher: String
  ) {
    getAllClassroomWithStudent(
      classroomid: $classroomid
      classname: $classname
      homeroomTeacher: $homeroomTeacher
    ) {
      classroomid
      classname
      academic_year
      homeroom_teacher
      students {
        studentid
        firstname
        lastname
        birthdate
        prefix {
          prefixid
          prefixname
        }
      }
    }
  }
`;

export const QueryGetOneClassroom = gql`
  query GetOneClassroom($classroomid: Float!) {
    getOneClassroom(classroomid: $classroomid) {
      classroomid
      classname
      homeroom_teacher
      academic_year
    }
  }
`;
