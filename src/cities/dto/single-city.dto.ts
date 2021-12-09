import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { weatherResponseDto } from "src/weather/dto/weather.dto";

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
    readonly forcast?:any

}
