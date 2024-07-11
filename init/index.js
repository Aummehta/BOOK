const mongoose=require("mongoose")
const initData=require("./data")
const Listing=require("../models/listing")

const MONGO_URL="mongodb://localhost:27017/booking"
main()
.then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})


async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"665d7ae71019279012d59928"}))
    await Listing.insertMany(initData.data)
}

initDB();