import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCityDto {
    @IsString()
    @ApiProperty({description:"name of city"})
    readonly name:string;
}
