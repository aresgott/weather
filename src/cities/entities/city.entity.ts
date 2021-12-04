import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class CityObj extends Document {
    @Prop()
    _id:string;
    
    @Prop()
    name:string;
}

export const CitySchema= SchemaFactory.createForClass(CityObj)