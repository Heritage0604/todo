'use client'
import { useBoardStore } from '@/store/BoardStore'
import React,{useEffect} from 'react'
import {DragDropContext,DropResult} from "react-beautiful-dnd"
import Columne from './Columne'
import dynamic from 'next/dynamic';
import { Column } from '@/typings'
import {toast} from "react-toastify" 


const Droppable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Droppable;
    }),
  {ssr: false},
);
const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Draggable;
    }),
  {ssr: false},
);

const Board = () => {

  const [board,getBoard,setBoard,updateTodoInDB]=useBoardStore((state)=>[state.board,state.getBoard,state.setBoard,state.updateTodoInDB])

  
    const handleDragEnd=(result:DropResult)=>{
     const {destination,source,type}=result; 
      if(!destination) return;
      
      // handle the column drag

      if(type==='column'){
        const entries=Array.from(board.columns.entries())
        const [removed]=entries.splice(source.index,1)
        entries.splice(destination.index,0,removed)
        const rearrangedColums=new Map(entries)
        setBoard({...board,columns:rearrangedColums})
        return
      }

      // this step is needed as the indexes are stored as numbers 0,1,2, etc .instead of id's with DND library

      const columns=Array.from(board.columns);
   
      const startColIndex=columns[Number(source.droppableId)]
      
      const finishColIndex=columns[Number(destination.droppableId)]
     

     const startCol:Column={
      id:startColIndex[0],
      todos:startColIndex[1].todos
     }

     const finishCol:Column={
      id:finishColIndex[0],
      todos:finishColIndex[1].todos
     }

     if(!startCol || !finishCol) return

     if(source.index== destination.index && startCol == finishCol) return

     const newTodos =startCol.todos
     const [todoMoved] = newTodos.splice(source.index,1)

     if(startCol.id == finishCol.id){
      // same column task drive
      newTodos.splice(destination.index,0,todoMoved)
      const newCol={
        id:startCol.id,
        todos:newTodos
      }
      const newColumns=new Map(board.columns)
      newColumns.set(startCol.id,newCol)
      setBoard({...board,columns:newColumns})
     }


      else{
      // dragging to a different column
      const finishTodos=Array.from(finishCol.todos)
      finishTodos.splice(destination.index,0,todoMoved)
            const newCol={
        id:startCol.id,
        todos:newTodos
      }
         const newColumns=new Map(board.columns)
      newColumns.set(startCol.id,newCol)
      newColumns.set(finishCol.id,{
        id:finishCol.id,
        todos:finishTodos
      })

      const myResult: Promise<"Success" | "Failure"> = updateTodoInDB(todoMoved,finishCol.id)
    
      setBoard({...board,columns:newColumns})

      myResult.then((result)=>{
        if (result == 'Success'){
          toast.success('Todo List updated successfully', {
position: "top-center",
autoClose: 1500,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
});
        }
        else{
toast.error('An Error Ocurred', {
position: "top-center",
autoClose: 1500,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
});
        }
      })

     }

    }

    useEffect(()=>{
        getBoard()
    },[getBoard])
  return (
  <DragDropContext onDragEnd={handleDragEnd}>
<Droppable droppableId='board' direction='horizontal' type='column'>
    {(provided)=>{
        return(
            <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            >

              {Array.from(board.columns.entries()).map(([id,column],index)=>{
                
                return(
                <Columne key={id} id={id} todos={column.todos} index={index} />
                )
              })}
              {provided.placeholder}
            </div>
        )
    }}
</Droppable>
  </DragDropContext>
  )
}

export default Board