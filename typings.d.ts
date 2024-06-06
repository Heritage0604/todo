import { Timestamp } from "firebase/firestore"

export type TypedColumn="todo"|"inprogress"|"done"
export interface Todo{
    title:string,
    image?:ImageObject,
    status:TypedColumn,
    updatedAt:Timestamp,
    id:string,
} 
export interface Column{
id:TypedColumn,
todos:Todo[]
}
export interface Board{
    columns: Map<TypedColumn,Column>
}

export interface ImageObject{
    bucketId:string;
    fileId:string
}