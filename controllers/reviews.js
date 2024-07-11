const Review=require("../models/review");
const ExpressError=require("../utils/ExpressError")
const {listingSchema,reviewSchema}=require("../schema")
const Listing=require("../models/listing");

module.exports.createReview=async(req,res)=>{
    let result=reviewSchema.validate(req.body);
  //  console.log(result)
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    let listing =await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created !")
    res.redirect(`/hotel/${listing._id}`)
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull :{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !")
    res.redirect(`/hotel/${id}`)
}