import { weather } from "./weather.dto";
export class WeatherSevenForcastDto {
    readonly cityIdF: string;
    readonly timestamp:number;
    readonly weathers: WeatherForcastDto;
}
export class WeatherForcastDto {
    readonly timestamp: number;
    readonly sunrise: number;
    readonly sunset: number;
    readonly moonrise: number;
    readonly moonset: number;
    readonly moonPhase: number;
    readonly temp: TempDto;
    readonly feelsLike: FeelsLikeDto;
    readonly pressure: number;
    readonly humidity: number;
    readonly dewPoint: number;
    readonly windSpeed: number;
    readonly windDeg: number;
    readonly windGust: number;
    readonly weather: Array<weather>;
    readonly clouds: number;
    readonly pop: number;
    readonly uvi: number;
}

export class FeelsLikeDto {
    readonly day: number;
    readonly night: number;
    readonly eve: number;
    readonly morn: number;
}
export class TempDto {
    readonly day: number;
    readonly min: number;
    readonly max: number;
    readonly night: number;
    readonly eve: number;
    readonly morn: number;
}
