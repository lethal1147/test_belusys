import { gql } from "@apollo/client";

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent($createStudentDto: CreateStudentDto!) {
    createStudent(createStudentDto: $createStudentDto) {
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

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent($updateStudentDto: UpdateStudentDto!) {
    updateStudent(updateStudentDto: $updateStudentDto) {
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

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($studentid: Float!) {
    deleteStudent(studentid: $studentid)
  }
`;

export const ADD_STUDENT_TO_CLASSROOM = gql`
  mutation AddStudentToClassroom($studentid: Float!, $classroomid: Float!) {
    addStudentToClassroom(studentid: $studentid, classroomid: $classroomid)
  }
`;

export const RemoveStudentFromClassroom = gql`
  mutation RemoveStudentFromClassroom($studentid: Float!) {
    removeStudentFromClassroom(studentid: $studentid)
  }
`;
