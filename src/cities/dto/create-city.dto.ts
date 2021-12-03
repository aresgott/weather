import { IsString } from "class-validator";

export class CreateCityDto {
    @IsString()
    readonly name:string;
}
