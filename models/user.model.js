import mongoose from 'mongoose';

const userSchema =new mongoose.Schema(
  {
    email: {
      type:String,
      required:true,
      unique:true,
    },
    fullName: {
      type:String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    role:{
      type:String,
      required:true,
      default:'User',
      enum:['Admin','User']
    },
    isGoogleSignin:{
      type:Boolean,
      default:false      
    }
  }
)

const User = mongoose.model('User', userSchema);

export default User;