import { gql } from "@apollo/client";

export const QueryGetAllGradeLevel = gql`
  query GetAllGradeLevel {
    getAllGradeLevel {
      gradelevelid
      levelName
    }
  }
`;

export const QueryGetAllPrefix = gql`
  query GetAllPrefix {
    getAllPrefix {
      prefixid
      prefixname
    }
  }
`;

export const QueryGetAllGender = gql`
  query GetAllGender {
    getAllGender {
      genderid
      gendername
    }
  }
`;

export const QueryGetAllMaster = gql`
  query GetAllMaster {
    getAllGender {
      genderid
      gendername
    }
    getAllPrefix {
      prefixid
      prefixname
    }
    getAllGradeLevel {
      gradelevelid
      levelName
    }
    getAllClassroom {
      classroomid
      classname
    }
  }
`;
