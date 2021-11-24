const mongoose=require("mongoose")

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log("database connected successfully");
         }
   catch (error) {
    console.log("database is not connected", error);
  }
}

module.exports=connectDB