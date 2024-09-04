import mongoose from "mongoose";


export const connectDB = (URI) =>{
  mongoose.connect(URI)
  .then(()=>{
    console.log("DB connected");
  })
  .catch((err)=>{
    console.log("Error occured :", err);
  })
}