import { australiaDepartments } from "./australia";

import { canadaDepartments } from "./canada";

import { ukDepartments } from "./uk";

import {
  usDepartments,
  usScienceAgencies,
  usInnovationAndIP,
  usIntelligenceAndOversight,
  usCongressional,
} from "./us";

export const departmentAgencies = [
  ...australiaDepartments,
  ...canadaDepartments,
  ...ukDepartments,
  ...usDepartments,
  ...usScienceAgencies,
  ...usInnovationAndIP,
  ...usIntelligenceAndOversight,
  ...usCongressional,
];

export const clearanceLevels = [
    "TS/SCI",
    "Top Secret",
    "Interim Top Secret",
    "Secret",
    "Interim Secret",
    "Confidential",
    "Public Trust",
    "NAC",
    "Q Clearance",
    "L Clearance",
    "CI Polygraph",
    "FS Polygraph",
    "Not Applicable"
  ];