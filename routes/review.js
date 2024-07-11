const express=require("express")
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema")
const wrapAsync=require("../utils/wrapAsync")
const Review=require("../models/review");
const ExpressError=require("../utils/ExpressError")
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,isReviewAuthor}=require("../middleware")
const reviewController=require("../controllers/reviews")
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;