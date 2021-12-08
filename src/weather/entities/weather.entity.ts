import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { coord, mainData, weather, wind } from "../dto/weather.dto";

@Schema()
export class WeatherObj extends Document {

    @Prop()
    cityIdF:string;

    @Prop()
    name:string;
    
    @Prop()
    cityId:number;

    @Prop()
    cityName:string;

    @Prop()
    coord: coord;
    
    @Prop()
    weather: weather;
    
    @Prop()
    main: mainData;
    
    @Prop()
    wind:wind;
    
    @Prop()
    timestamp:number;
    
}

export const WeatherSchema= SchemaFactory.createForClass(WeatherObj)