import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { coord } from "../../weather/dto/weather.dto";

@Schema()
export class CityObj extends Document {
    @Prop()
    coord:coord
    
    @Prop()
    cityId:number;

    @Prop()
    name:string;
}

export const CitySchema= SchemaFactory.createForClass(CityObj)