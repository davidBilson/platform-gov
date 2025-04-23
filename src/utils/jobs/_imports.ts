// imports.ts

// React & Hooks
import React, { useState, useRef, useEffect } from 'react';

// Static Data
import {
  locationList,
  jobCategoryList,
  requiredCertificationsList,
  requiredSkillsList
} from './_static_data';

// Icons
import {
  IoMdArrowDropdown,
  IoMdCalendar,
  IoIosSearch
} from 'react-icons/io';

import { IoCloseOutline } from 'react-icons/io5';

import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine
} from 'react-icons/ri';

import { FiTrash } from 'react-icons/fi';

import {
  MdOutlineRadioButtonUnchecked,
  MdOutlineRadioButtonChecked
} from 'react-icons/md';

// Datepicker & Modal
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddMilestoneModal from '@/pages/job/create/_addMilestoneModal';

// Types
export type { JobFormData, Milestone } from "@/types/jobs";

// Grouped Exports
export const ReactLib = { React, useState, useRef, useEffect };
export const Data = {
  locationList,
  jobCategoryList,
  requiredCertificationsList,
  requiredSkillsList
};
export const Icons = {
  IoMdArrowDropdown,
  IoMdCalendar,
  IoIosSearch,
  IoCloseOutline,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  FiTrash,
  MdOutlineRadioButtonUnchecked,
  MdOutlineRadioButtonChecked
};
export const UI = { DatePicker, AddMilestoneModal };
