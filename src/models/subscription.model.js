import mongoose ,{Schema} from "mongoose"


const SubscriptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, //one who is subscribing 
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, //one to whom 'subscriber is subscribing 
        ref:"user"
    }
},{
    timestamps:true
})

export const Subscription=mongoose.model("Subscription",SubscriptionSchema)