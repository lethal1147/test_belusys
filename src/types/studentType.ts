import { FilterQuery } from "./utilsType";

export interface FilterGetAllStudents extends FilterQuery {
  textSearch?: string;
  studentid?: number;
  gradelevelid?: number;
}

export type GenderType = {
  genderid: number;
  gendername: string;
};

export type PrefixType = {
  prefixid: number;
  prefixname: string;
};

export type GradeLevelType = {
  gradelevelid: number;
  levelName: string;
};

export type StudentType = {
  birthdate: Date;
  firstname: string;
  gender: GenderType;
  gradeLevel: GradeLevelType;
  lastname: string;
  prefix: PrefixType;
  studentid: number;
};

export type StudentOptionType = {
  studentid: number;
  firstname: string;
  prefix: PrefixType;
  lastname: string;
};
