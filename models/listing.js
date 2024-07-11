const mongoose=require("mongoose")
const Schema=mongoose.Schema
const Review=require("./review");
const { listingSchema } = require("../schema");
const listSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image :{
        url:String,
        filename:String,
    },
    image2: {
        url:String,
        filename:String,
        
    },
    image3: {
        url:String,
        filename:String,
    },
    image4: {
        url:String,
        filename:String,
    },
    image5: {
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listSchema)
module.exports =Listing