if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express=require("express")
const app=express()
const mongoose=require("mongoose")

// const Listing=require("../Booking/models/listing");
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://localhost:27017/booking"
// const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError")
// const {listingSchema,reviewSchema}=require("./schema")
// const Review=require("../Booking/models/review");

const flash=require("connect-flash")
const session= require("express-session")
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user")

const listingRouter=require("./routes/listing")
const reviewRouter=require("./routes/review")
const userRouter=require("./routes/user")

main()
.then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;


    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"del-student"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/" , listingRouter)
app.use("/hotel/:id/reviews",reviewRouter)
app.use("/",userRouter)

// app.get("/", wrapAsync(async (req, res) => {
//     const alllistings = await Listing.find({});
//     res.render("listings/index.ejs", { alllistings });
// }));

// app.get("/hotel/new",wrapAsync(async(req,res)=>{
//     res.render("listings/new.ejs")
// }))

  
// app.get("/hotel/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params
//     const listing=await Listing.findById(id).populate("reviews")
//     res.render("listings/show.ejs",{listing})
// }))

// app.get("/hotel/:id/edit",wrapAsync(async(req,res)=>{
//     let {id}=req.params
//     const listing=await Listing.findById(id)
//     res.render("listings/edit.ejs",{listing})
// }))

// app.get("/search", wrapAsync(async (req, res) => {
//     const { query } = req.query;
//     const alllistings = await Listing.find({
//         $or: [
//             { title: new RegExp(query, 'i') },
//             { description: new RegExp(query, 'i') },
//             { location: new RegExp(query, 'i') }
//         ]
//     });
//     res.render("listings/index.ejs", {alllistings});
// }));

// app.put("/hotel/:id",wrapAsync(async(req,res)=>{
//     let result=listingSchema.validate(req.body);
//     console.log(result)
//     if(result.error){
//         throw new ExpressError(400,result.error)
//     }
    
//     let {id}=req.params
//     await Listing.findByIdAndUpdate(id,{...req.body.listing})
//     res.redirect(`/hotel/${id}`)
// }))

// app.delete("/hotel/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params
//     let deletedlisting=await Listing.findByIdAndDelete(id)
//     res.redirect("/")
// }))

// app.post("/",wrapAsync(async(req,res,next)=>{
//     let result=listingSchema.validate(req.body);
//     // console.log(result)
//     if(result.error){
//         throw new ExpressError(400,result.error)
//     }
//     const newlisting =new Listing(req.body.listing)
//     // console.log(newlisting)
//     await newlisting.save();
//     res.redirect("/");
   
// }))

// app.post("/hotel/:id/reviews",wrapAsync(async(req,res)=>{
//     let result=reviewSchema.validate(req.body);
//   //  console.log(result)
//     if(result.error){
//         throw new ExpressError(400,result.error)
//     }
//     let listing =await Listing.findById(req.params.id);
//     let newReview =new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/hotel/${listing._id}`)
// }))

// app.delete("/hotel/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId}= req.params;
//     await Listing.findByIdAndUpdate(id, {$pull :{reviews : reviewId}})
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/hotel/${id}`)
// }))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found !"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message)
    // res.send("Something went wrong")
})
app.listen(8080,()=>{
    console.log("Server listening")
})

