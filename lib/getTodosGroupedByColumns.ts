import { db } from "@/firebaseConfig"
import { Board, Column, Todo, TypedColumn } from "@/typings";
import { DocumentData, collection, getDocs } from "firebase/firestore";

const getTodosGroupedByColumns = async() => {

  const todoArrays:DocumentData=[]
const querySnapshot = await getDocs(collection(db, "todoList"));
// console.log(querySnapshot)
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  todoArrays.push({...doc.data(),id:doc.id})
  // console.log(doc.id, " => ", doc.data());
});



  
const columns:Map<TypedColumn,Column>=todoArrays.reduce((acc:Map<TypedColumn,Column>,todo:DocumentData)=>{
    if(!acc.get(todo.status)){
      acc.set(todo.status,{
        id:todo.status,
        todos:[]
      })
      
    }
    acc.get(todo.status)!.todos.push(
      {
        updatedAt:todo.updatedAt,
        title:todo.title,
        status:todo.status,
        id:todo.id,
        ...(todo.image && {image:(todo.image)})
      }
    )

    return acc


},new Map<TypedColumn,Column>)




const columnTypes:TypedColumn[]=['todo','inprogress','done']

for(const columnType of columnTypes){
    if(!columns.get(columnType)){
        columns.set(
            columnType,{
                id:columnType,
                todos:[]
            }
        )
    }
}

const sortedColumns= new Map(
   Array.from(columns.entries()).sort((a,b)=>(
    columnTypes.indexOf(a[0]) -columnTypes.indexOf(b[0])
   ))
)

const board:Board={
    columns:sortedColumns
}

return board

}

export default getTodosGroupedByColumns