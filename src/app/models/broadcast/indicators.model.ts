export class Indicators {
    id: number;
    name: string;
    description: string;
    byEstablishment: boolean;
    byDocStruct: boolean;
    byRegion: boolean;
    global: boolean;
    keyFigure: boolean;
    active: boolean;
    displayOrder: number;
    administrator: boolean;
    prefix?: string;
    suffix?: string;
    result?: {
        byEstablishment?: any;
        byDocStruct?: any;
        byRegion?: any;
        global?: any;
    };
    query?: any;
}
