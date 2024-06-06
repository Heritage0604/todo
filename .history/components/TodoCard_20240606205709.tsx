'use client'
import { Todo, TypedColumn } from '@/typings'
import { useDisclosure } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import { MdCancel } from 'react-icons/md'
import { CiEdit } from "react-icons/ci";
import EditModal from './EditModal';

type Props = {
       todo:Todo,
    index:number,
    id:TypedColumn,
    innerRef:(element:HTMLElement | null)=>void,
    draggableProps:DraggableProvidedDraggableProps,
    dragHandleProps:DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({todo,index,id,innerRef,draggableProps,dragHandleProps}: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [todoType,setTodoType]=useState<TypedColumn>('todo')
  return (
       <div
    className='bg-white rounded-md space-y-2 drop-shadow-md'
    {...draggableProps}
    {...dragHandleProps}
    ref={innerRef}
    >
        <div className=' relative p-3'>
            <p className='mt-4 mr-8 '>{todo.title}</p>
            {todo.image && <Image 
            // priority
                  src={todo.image?.fileId} alt={todo.title}
                    placeholder="blur"
                    blurDataURL={'/img/logo.png'}
              className='w-full mt-4 rounded-b-2xl' width={300}
               height={300}/>}
           
            <button onClick={()=>{
                setTodoType(id);
                onOpen();
                }}className=' absolute top-5 right-3 text-gray-500 hover:text-gray-500'>
                <CiEdit className='ml-5 h-8 w-8'/>
            </button>
        </div>
        {isOpen && (
                    < EditModal id={todo.id} imageList={todo.image ? todo.image : null} title={todo.title} setTodoType={setTodoType} todoType={todoType} isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
                    )} 
    </div>
  )
}

export default TodoCard