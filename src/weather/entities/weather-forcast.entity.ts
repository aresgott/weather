import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { WeatherForcastDto } from "../dto/forcast.dto";

@Schema()
export class WeatherForcastObj extends Document {

    @Prop()
    cityIdF:string;

    @Prop()
    timestamp: number;
    
    @Prop()
    weathers: Array<WeatherForcastDto>;
    
}

export const WeatherForcastSchema= SchemaFactory.createForClass(WeatherForcastObj)