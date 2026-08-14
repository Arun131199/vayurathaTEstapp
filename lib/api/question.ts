import api from "../axios";

export async function importQuestion(file:File){
    const formData=new FormData();
    formData.append("file",file)

    const response=await api.post(
        "/admin/questions/import",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );

    return response.data;
}