import getTodosGroupedByColumns from "@/lib/getTodosGroupedByColumns";
import { Board, TypedColumn,Column, Todo, ImageObject } from "@/typings";
import { create } from "zustand";
import { collection, doc, query, updateDoc,deleteField, where,addDoc,Timestamp, arrayUnion,deleteDoc } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadString , deleteObject ,getStorage  } from "firebase/storage";


interface BoardState{
    board:Board,
    getBoard:()=>void,
    setBoard:(board:Board)=>void,
    updateTodoInDB:(todo:Todo , columnId:TypedColumn)=> Promise<"Success" | "Failure">,
    searchString:string;
    setSearchString:(searchString:string)=>void,
    addToDB:(title:string,status:TypedColumn,image?:string)=>void,
    editToDB: (title: string, id: string, status: TypedColumn, changed: boolean, image?: string, imageList?: ImageObject | null | undefined,) => void,
    deletefromDB:(id:string ,imageList?: ImageObject | null | undefined)=> Promise<"Success" | "Failure">
}

function generateRandomString(length:number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const useBoardStore = create<BoardState>((set) => ({
board:{
    columns:new Map<TypedColumn,Column>()
},

getBoard:async()=>{
    const board=await getTodosGroupedByColumns();
    set({board});
},
setBoard:(board)=>set({board}),

updateTodoInDB:async(todo,columnId)=>{
try{
    const TodosRef = doc(db, "todoList", todo.id);
    const success='Success'
await updateDoc(TodosRef, {
  status:columnId
});
return success
}
catch(e:any){
    const failure='Failure'
return failure
}

},
searchString:"",

setSearchString:(searchString)=>{
set({searchString})
},

addToDB:async(title,status,image)=>{
try{
    const bucketId = generateRandomString(20);
 

const docRef = await addDoc(collection(db, "todoList"), {
 title:title,
 status:status,
 updatedAt:Timestamp.fromDate(new Date()),
});

   if(image){
        const imageRef = ref(storage, `todo/${bucketId}/image`);
        await uploadString(imageRef, image, "data_url");
        const downloadURL =   await getDownloadURL(imageRef);
         await updateDoc(doc(db, "todoList", docRef.id), {
       image: {bucketId:bucketId,fileId:downloadURL}
      });
    }

const board=await getTodosGroupedByColumns();
set({board});

}
catch(e:any){
    
}
},

// edit the db when a user is edited
editToDB:async(title,id,status,changed,image,imageList,)=>{
    
const editRef = doc(db, "todoList", id);
const infoDate= new Date()


try{
    await updateDoc(editRef, {
  title:title,
  status:status
  
});

console.log(imageList)
console.log(imageList?.fileId == image)
if(imageList?.fileId == image){

}else{
    if(!image){
        const deleteRef = ref(storage, `todo/${imageList?.bucketId}/image`);

// Delete the file
deleteObject(deleteRef).then(() => {

}).catch((error) => {
//   throw new Error('An error occured')
});

const dbRef = doc(db, 'todoList', id);

// Remove the 'capital' field from the document
await updateDoc(dbRef, {
    image: deleteField()
});

    }
    if(image){
        const deleteRef = ref(storage, `todo/${imageList?.bucketId}/image`);
       deleteObject(deleteRef).then(() => {

}).catch((error) => {
//   throw new Error('An error occured')
}); 

const imageRef = ref(storage, `todo/${infoDate}/image`);
        await uploadString(imageRef, image, "data_url");
        const downloadURL =   await getDownloadURL(imageRef);
         await updateDoc(doc(db, "todoList", id), {
       image: {bucketId:infoDate.toDateString(),fileId:downloadURL}
      });

    }
}

const board=await getTodosGroupedByColumns();
set({board});



// return 'Success'
}catch(e:any){
// return 'Failure'
console.log(e)
}

    },

    deletefromDB: async (id,imageList) => {
     const success='Success'
    try {

        if (imageList) {
            const bucketId = imageList.bucketId;
            const imageRef = ref(storage, `todo/${bucketId}/image`)
            deleteObject(imageRef).then(async() => {
                await deleteDoc(doc(db, "todoList", id));
            }).catch((error:any) => {
                throw new Error("An error occured");
            })

            
        }
        else {
            await deleteDoc(doc(db, "todoList", id));
        }
        

        const board=await getTodosGroupedByColumns();
        set({board});
        return success

    } catch (error: any) {
        const failure="Failure"
        return failure
        
    }
    console.log(id)
    console.log(imageList)

    // console.log(id)
}


}))