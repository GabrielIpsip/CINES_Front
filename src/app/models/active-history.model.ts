import { AdministrationTypesEnum } from '../common/administration-types.enum';
import { Administrations } from './administrations.model';

export class ActiveHistory {
    administration: Administrations;
    surveyId: number;
    administrationType: AdministrationTypesEnum;
    active: boolean;
}
