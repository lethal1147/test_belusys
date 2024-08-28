import { gql } from "@apollo/client";

export const CreateNewClassroom = gql`
  mutation CreateNewClassroom($createClassroomDto: CreateClassroomDto!) {
    createNewClassroom(createClassroomDto: $createClassroomDto) {
      classroomid
      classname
      academic_year
      homeroom_teacher
    }
  }
`;

export const UpdateClassroom = gql`
  mutation EditClassroom($editClassroomDto: EditClassroomDto!) {
    editClassroom(editClassroomDto: $editClassroomDto) {
      classroomid
      classname
      academic_year
      homeroom_teacher
    }
  }
`;

export const DeleteClassroom = gql`
  mutation DeleteClassroom($classroomid: Int!) {
    deleteClassroom(classroomid: $classroomid)
  }
`;
