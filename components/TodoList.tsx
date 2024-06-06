import { TypedColumn } from '@/typings'
import React from 'react'
import {AiOutlineCheck} from "react-icons/ai"
type Props={
    title:TypedColumn,
    text:string,
    todoType:TypedColumn,
    color:string,
    setTodoType:(todo:TypedColumn)=>void,
}
const TodoList = ({title,text,todoType,color,setTodoType}:Props) => {
    const idToColumnText:{
    [key in TypedColumn] :string
}={
    'todo':'To Do',
    'inprogress':'In Progress',
    'done':'Done'
}
  return (
        <div onClick={()=>setTodoType(title)} className={` ${todoType == title ? `${color}  text-white`:"bg-white"} cursor-pointer   text-gray-500 mt-2 border-2 p-2 rounded-2xl`}>
              <p>{idToColumnText[title]}</p>
              
              <div className='flex  justify-between'>
                <p>{text}</p>
                {todoType== title && <AiOutlineCheck className='text-lg mr-2'/>}
              </div>
            </div>
  )
}

export default TodoList