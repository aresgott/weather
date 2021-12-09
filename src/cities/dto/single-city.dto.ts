import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { WeatherForcastDto } from "src/weather/dto/forcast.dto";
import { weatherResponseDto } from "../../weather/dto/weather.dto";

export class SingleCityDto {
    @IsNumber()
    @ApiProperty({description:"id of city"})
    readonly id?:number;

    @IsString()
    @ApiProperty({description:"name of city"})
    readonly name:string;

    @ApiProperty({description:"weather"})
    readonly weather?:weatherResponseDto

    @ApiProperty({description:"weather forcast"})
    readonly forcast?:WeatherForcastDto

}

export class SingleCityWithoutForcastDto {
    @IsNumber()
    @ApiProperty({description:"id of city"})
    readonly id?:number;

    @IsString()
    @ApiProperty({description:"name of city"})
    readonly name:string;

    @ApiProperty({description:"weather"})
    readonly weather?:weatherResponseDto

}
export class SingleNameCity{

    @IsNumber()
    @ApiProperty({description:"id of city"})
    readonly id?:number;

    @IsString()
    @ApiProperty({description:"name of city"})
    readonly name:string;
}