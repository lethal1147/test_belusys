import { gql } from "@apollo/client";

export const QueryGetAllStudents = gql`
  query GetAllstudents(
    $page: Int
    $pageLimit: Int
    $studentid: Float
    $textSearch: String
    $gradelevelid: Float
  ) {
    getAllstudents(
      page: $page
      pageLimit: $pageLimit
      studentid: $studentid
      textSearch: $textSearch
      gradelevelid: $gradelevelid
    ) {
      data {
        studentid
        firstname
        lastname
        birthdate
        gender {
          genderid
          gendername
        }
        gradeLevel {
          gradelevelid
          levelName
        }
        prefix {
          prefixid
          prefixname
        }
      }
      total
    }
  }
`;

export const QueryGetOneStudentById = gql`
  query GetOneStudentById($studentid: Float) {
    getOneStudent(studentid: $studentid) {
      studentid
      firstname
      lastname
      birthdate
      gender {
        genderid
        gendername
      }
      gradeLevel {
        gradelevelid
        levelName
      }
      prefix {
        prefixid
        prefixname
      }
      studentClassrooms {
        classroom {
          classroomid
          classname
        }
      }
    }
  }
`;

export const QueryGetAllStudentDropdown = gql`
  query GetAllStudentDropdown {
    getAllStudentDropdown {
      studentid
      firstname
      lastname
      prefix {
        prefixname
      }
    }
  }
`;
