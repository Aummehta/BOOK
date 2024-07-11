const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync")
const {listingSchema,reviewSchema}=require("../schema")
const ExpressError=require("../utils/ExpressError")
const Listing=require("../models/listing");
const flash=require("connect-flash")
const {isLoggedIn,isOwner}=require("../middleware")

const listingController=require("../controllers/listing")
const multer=require('multer')
const {storage}=require("../cloudConfig");
const upload=multer({storage})


router.route("/")
.get( wrapAsync(listingController.index))
// .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));
.post(isLoggedIn, upload.fields([
    { name: 'listing[image]', maxCount: 1 },
    { name: 'listing[image2]', maxCount: 1 },
    { name: 'listing[image3]', maxCount: 1 },
    { name: 'listing[image4]', maxCount: 1 },
    { name: 'listing[image5]', maxCount: 1 }
]), wrapAsync(listingController.createListing));

//hello world
router.get("/hotel/new",isLoggedIn,listingController.renderNewForm)

router.route("/hotel/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.fields([
    { name: 'listing[image]', maxCount: 1 },
    { name: 'listing[image2]', maxCount: 1 },
    { name: 'listing[image3]', maxCount: 1 },
    { name: 'listing[image4]', maxCount: 1 },
    { name: 'listing[image5]', maxCount: 1 }
]),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// router.get("/", wrapAsync(listingController.index));



  
// router.get("/hotel/:id",wrapAsync(listingController.showListing))

router.get("/hotel/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

// router.put("/hotel/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing))

//router.delete("/hotel/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

// router.post("/",isLoggedIn,wrapAsync(listingController.createListing))

router.get("/myhotel",isLoggedIn,wrapAsync(listingController.ownListing))
router.get("/search", wrapAsync(listingController.searchListing));
module.exports=router; 