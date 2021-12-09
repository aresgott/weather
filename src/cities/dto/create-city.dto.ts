import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";
import {  weatherResponseDto } from "../../weather/dto/weather.dto";

export class CreateCityDto {
    @IsString()
    @ApiProperty({ description: "name of city" })
    readonly name: string;

}

export class AddedCityDto {
    @IsBoolean()
    @ApiProperty({ description: "result of query" })
    readonly hasError: boolean;

    @IsString()
    @ApiProperty({ description: "message for result" })
    message?: Array<string>

    @ApiProperty({ description: "Response from weather service" })
    weather?: weatherResponseDto
}
