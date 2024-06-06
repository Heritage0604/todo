'use client'
import { Todo, TypedColumn } from "@/typings"
import dynamic from 'next/dynamic';
import { useBoardStore } from "@/store/BoardStore";
import TodoCard from "./TodoCard";
import {AiFillPlusCircle} from "react-icons/ai"
import {useState,useEffect} from "react"
import { useDisclosure} from "@chakra-ui/react"
import ModalBodyForm from "./ModalBody";


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


type Props={
  id:TypedColumn,
  todos:Todo[],
  index:number
}

const idToColumnText:{
    [key in TypedColumn] :string
}={
    'todo':'To Do',
    'inprogress':'In Progress',
    'done':'Done'
}

const Columne = ({id,todos,index}:Props) => {
  const searchString =useBoardStore((state)=>state.searchString)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [todoType,setTodoType]=useState<TypedColumn>('todo')

  // useEffect(() => {
  //    if(isOpen){
  //   console.log('Hello world')
  //    <ModalBodyForm isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
  // }

  // }, [isOpen])
  

  return (
     <Draggable draggableId={id} index={index}>
            {(provided)=>(
                <div 
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                    {/* render droppable todos inside the droppable column */}
                    <Droppable 
                    droppableId={index.toString()}
                    // droppableId={'board'}
                     type='card'>
                        {(provided,snapshot)=>(
                            <div
                             {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`pb-2 p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ?"bg-green-200":"bg-white/40"}`}
                            >
                                <h2 className="flex justify-between font-bold text-xl p-2">
                                    {idToColumnText[id]}
                                
                                <span className="text-gray-500 bg-gray-200 
                                rounded-full px-2 py-1 text-sm font-normal">{!searchString ? todos.length:todos.filter(todo=>todo.title.toLocaleLowerCase().includes(searchString.toLowerCase())).length}</span>
                                </h2>

                                <div className="space-y-2">
                                {todos.map((todo,index)=>{
                                    if(searchString && !todo.title.toLocaleLowerCase().includes(searchString.toLowerCase())) return null
                                    return(
                                    <Draggable key={todo.title} draggableId={todo.title} index={index}>
                                            {(provided)=>(
                                                <TodoCard 
                                                todo={todo}
                                                index={index}
                                                id={id}
                                                innerRef={provided.innerRef}
                                                draggableProps={provided.draggableProps}
                                                dragHandleProps={provided.dragHandleProps}/>
                                            )}
                                    </Draggable>
                                )})}
                                    {provided.placeholder}
                                    <div className='flex items-end justify-end p-2'>
                                        <button onClick={()=>{
                                          setTodoType(id);
                                          onOpen();
                                        }} className="text-green-500 hover:text-green-600">
                                            <AiFillPlusCircle className="h-10 w-10 "/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                            
                        }
                    </Droppable>
                    {isOpen && (
                    <ModalBodyForm setTodoType={setTodoType} todoType={todoType} isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
                    )}
                </div>
            )}
        </Draggable>
  )
}

export default Columne