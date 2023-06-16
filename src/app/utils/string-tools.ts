export class StringTools {

    static strToNumber(value: string, float: boolean, locale: string): number {
        if (value == null) {
            return null;
        }
        switch (locale) {
            case 'en':
                value = value.replace(',', '');
                break;
            default:
                value = value.replace(/\s/g, '');
                value = value.replace(',', '.');
                break;
        }
        if (float) {
            return parseFloat(value);
        } else {
            return parseInt(value, 10);
        }
    }

    static numberPattern(locale: string): RegExp {
        switch (locale) {
            case 'en':
                return new RegExp(/^[0-9-,.]*$/);
            default:
                return new RegExp(/^[0-9-,\s]*$/);
        }
    }

    static strToBool(str: string): boolean {
        return str === 'true';
    }

    static buildQuery(queryValue: string): string {
        let query: string;
        if (queryValue) {
            query = queryValue.trim();
            query = queryValue.toLocaleLowerCase();
            query = query.replace(/ /gm, '+');
            query = query.replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ+]/igm, '+');
            query = query.replace(/^\++|\++$/gm, '');
            query = query.replace(/\++/gm, '+');
        }
        return query;
    }

    static getOptionValueFromRegexSelectWord(constraintRegex: string): string[] {
        let values: string[];

        const patternSelect1 = new RegExp(/(\^\(([a-z0-9_àâçéèêëîïôûùüÿñæœ]+[|)]+)+\$)/iy);
        const patternSelect2 = new RegExp(/([a-z0-9_àâçéèêëîïôûùüÿñæœ]+\|?)+/iy);

        const pattern1 = patternSelect1.test(constraintRegex);
        const pattern2 = patternSelect2.test(constraintRegex);

        if (!pattern1 && !pattern2) {
            return null;
        }

        let formatRegex = constraintRegex;

        if (pattern1) {
            formatRegex = constraintRegex
                .replace('$', '')
                .replace('^', '')
                .replace('(', '')
                .replace(')', '');
        }

        values = formatRegex.split('|');

        return values;
    }

    static toTitleCase(str: string): string {
        return (str != null && str.length > 1)
            ? str[0].toUpperCase() +
            str.slice(1)
            : str;
    }

}
