export class weatherResponseDto {
    readonly cityId:number;
    readonly status?: number;
    readonly coord: coord;
    readonly weather: weather;
    readonly main: mainData;
    readonly wind:wind;
}
export class weatherDto {
    readonly cityIdF:string;
    readonly timestamp:number;
    readonly coord: coord;
    readonly weather: weather;
    readonly main: mainData;
    readonly wind:wind;
}

export class coord {
    readonly lon: number;
    readonly lat: number;
}

export class weather {
    readonly id: number;
    readonly main: string;
    readonly description: string;
    readonly icon: string;
}
export class mainData {
    readonly temp: number;
    readonly feels_like: number;
    readonly temp_min: number;
    readonly temp_max: number;
    readonly pressure: number;
    readonly humidity: number;
}
export class wind {
    readonly speed: number;
    readonly deg: number;
}