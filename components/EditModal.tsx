'use client'
import React,{useState,useEffect} from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
} from '@chakra-ui/react'

import { ImageObject, TypedColumn } from "@/typings"
import TodoList from "./TodoList"
import Image from "next/image"
import { MdCancel } from "react-icons/md"
import { useBoardStore } from "@/store/BoardStore"
import {toast} from "react-toastify" 

type Props={
  isOpen:boolean,
  onClose:()=>void,
  onOpen:()=>void,
  todoType:TypedColumn,
  setTodoType:(todo:TypedColumn)=>void,
  title:string,
  imageList:ImageObject | null |undefined
  id:string
}

 const EditModal=({id,imageList,title,isOpen,onClose,onOpen,todoType,setTodoType}:Props)=>{
  const [image,setImage]=useState(imageList?.fileId)
  const [task,setTask]=useState(title)
  const[changed,setChanged]=useState(false)
  const [addToDB,editToDB,deleteFromDB]=useBoardStore((state)=>[state.addToDB,state.editToDB,state.deletefromDB])

   const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setImage(readerEvent.target?.result as string);
      }
    };
  };
  
  const onRemoveImage=()=>{
      setImage('')
  }

  const onSubmit=()=>{
    if(image){
      editToDB(task,id,todoType,changed,image,imageList,)
      onClose()
      //  console.log(' image')
       
    }
    else{
      editToDB(task,id,todoType,changed,image,imageList,)
      onClose()
      // console.log('no image')
    }
    
   }
   
   const onDelete = () => {

     const myResult: Promise<"Success" | "Failure"> = deleteFromDB(id, imageList);
     onClose();

        myResult.then((result)=>{
        if (result == 'Success'){
          toast.success('Todo deleted successfully', {
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

return (
    <div>
         <Modal size={'lg'} scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit a Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            <Input value={task} onChange={(e)=>setTask(e.target.value)} placeholder='Add a task...' />

              <TodoList setTodoType={setTodoType} todoType={todoType} color='bg-red-500' title={'todo'} text={"A new task to be completed"}/>
              <TodoList setTodoType={setTodoType} todoType={todoType} color='bg-yellow-500' title={'inprogress'} text={"A task that is currently being worked on"} />
              <TodoList setTodoType={setTodoType} todoType={todoType} color='bg-green-500' title={'done'} text={"A task thats has been completed"}/>

            {image && (
              <div className='mt-6 relative'>
                <Image alt='Todo Image' className='w-full h-40 object-cover' src={image} width={300} height={300}/>
                 <button onClick={onRemoveImage} className='text-red-500 absolute top-0 right-0 hover:text-red-600'>
                <MdCancel className='ml-5 h-8 w-8'/>
            </button>
              </div>
            )}

              <label   className='mt-2 h-16 cursor-pointer bg-gray-300 text-sm text-gray-500 rounded-lg border flex justify-center items-center w-full'>
     
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 mr-1 w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
</svg>
     Upload
<input type="file" onChange={onSelectImage} className='hidden' accept="image/*"  />

        </label>
        

          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onSubmit}>Edit Task</Button>
            <Button variant='ghost' colorScheme="red" onClick={onDelete}>Delete Task</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
)
}

export default EditModal