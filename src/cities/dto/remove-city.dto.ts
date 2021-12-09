import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber } from "class-validator";
import {  SingleNameCity } from "./single-city.dto";

export class RemoveCityDto {
    @IsBoolean()
    @ApiProperty({ description: "result of query" })
    readonly hasError: false;

    @IsNumber()
    @ApiProperty({ description: "message result" })
    message: string
    
    @IsArray()
    @ApiProperty({ description: "city which removed"  })
    readonly result?: SingleNameCity;
}
