import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { StringTools } from '../utils/string-tools';

export function strIntegerValidator(locale: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        const value = StringTools.strToNumber(control.value, true, locale);

        if (value % 1 > 0) {
            return { integer: true };
        }
        return null;
    };
}
