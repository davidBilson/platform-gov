export { professionalFieldsAndAreasOfExpertise } from './general';
export { canadaProfessionalFields } from './canada';
export { ukProfessionalFields } from './unitedKingdom';
export { australiaProfessionalFields } from './australia';

import { professionalFieldsAndAreasOfExpertise } from './general';
import { canadaProfessionalFields } from './canada';
import { ukProfessionalFields } from './unitedKingdom';
import { australiaProfessionalFields } from './australia';

export const professionalFields = [
    ...professionalFieldsAndAreasOfExpertise,
    ...canadaProfessionalFields,
    ...ukProfessionalFields,
    ...australiaProfessionalFields,
];