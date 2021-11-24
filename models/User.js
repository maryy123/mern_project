const mongoose=require("mongoose")
const {Schema,model}=mongoose

const userSchema=new Schema({
    name:{type:String,required:true},
    email: { type: String, required: true , unique:true },
    password: { type: String, required: true },
    phone: Number,
    image:{type:String,required:false},
    description:{type:String,required:false},
    location:{type:String,required:false},
    isAdmin:{type:Boolean,default:false,required:true},
    isSeller:{type:Boolean,default:true,required:true}, 
    seller: {
        name:{type:String,required:false},
        // logo: String,
        description: String,
        location: String,
        rating: { type: Number, default: 0, required: false },
        numReviews: { type: Number, default: 0, required: false },
      },
    userType: {
        type: String,
        enum : ['user','charitable organization','restaurant/mall'],
        default: 'user'
    }
},
    {
        timestamps: true,
    }
)

module.exports=User=model("user",userSchema)