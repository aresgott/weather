import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber } from "class-validator";
import { weatherResponseDto } from "src/weather/dto/weather.dto";
import { SingleCityDto } from "./single-city.dto";

export class ListCityDto {
    @IsBoolean()
    @ApiProperty({ description: "result of query" })
    readonly hasError: false;

    @IsNumber()
    @ApiProperty({ description: "count of result" })
    count: number
    
    @IsArray()
    @ApiProperty({ description: "list of city" })
    readonly result: Array<SingleCityDto>;



}
