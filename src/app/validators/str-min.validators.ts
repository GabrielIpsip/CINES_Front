import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { StringTools } from '../utils/string-tools';

export function strMinValidator(min: number, locale: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        const value = StringTools.strToNumber(control.value, true, locale);

        if (value < min) {
            return { strMin: true };
        }
        return null;
    };
}
