const Listing=require("../models/listing")
const {listingSchema,reviewSchema}=require("../schema")
const ExpressError=require("../utils/ExpressError")
const Review=require("../models/review");

module.exports.index=async (req, res) => {
    const alllistings = await Listing.find({}).populate('reviews');
    alllistings.forEach(listing => {
        const reviews = listing.reviews;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            listing.averageRating = Number.isInteger(averageRating) ? averageRating : averageRating.toFixed(1);
        }
    });
    res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm=(req,res)=>{

    res.render("listings/new.ejs")
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Hotel you requested for does not exist!")
        res.redirect("/")
    }

    res.render("listings/show.ejs",{listing})
}

module.exports.createListing=async(req,res,next)=>{
    
    let result=listingSchema.validate(req.body);
    // console.log(result)
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    // let url=req.file.path;
    // let filename=req.file.filename;

    // const newlisting =new Listing(req.body.listing)
    // newlisting.owner=req.user._id;
    // newlisting.image={url,filename}
    const images = [];

    // Handle the first image (listing[image])
    if (req.files && req.files['listing[image]']) {
        const url = req.files['listing[image]'][0].path;
        const filename = req.files['listing[image]'][0].filename;
        images.push({ url, filename });
    }

    // Handle additional images (listing[image2], listing[image3], ...)
    for (let i = 2; i <= 5; i++) {
        if (req.files && req.files[`listing[image${i}]`]) {
            const url = req.files[`listing[image${i}]`][0].path;
            const filename = req.files[`listing[image${i}]`][0].filename;
            images.push({ url, filename });
        }
    }
    
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    images.forEach((image, index) => {
        // Adjust the index to start from 1
        const imageField = index === 0 ? 'image' : `image${index + 1}`;
        newlisting[imageField] = image;
    });
    
    await newlisting.save();
    req.flash("success","New Hotel Created !")
    res.redirect("/");
   
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id)
    if(!listing){
        req.flash("error","Hotel you requested for does not exist!")
        res.redirect("/")
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing=async(req,res)=>{
    let result=listingSchema.validate(req.body);
    
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    
    let { id } = req.params;

    // Fetch the existing listing
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Hotel you requested for does not exist!");
        return res.redirect("/");
    }

    // Update listing with non-image fields
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.body.deleteImages) {
        for (let field of req.body.deleteImages) {
            listing[field] = undefined; // Remove the image field
        }
    }

    // Handle image updates
    if (typeof req.files !== "undefined") {
        const images = [];

        // Handle the first image (listing[image])
        if (req.files && req.files['listing[image]']) {
            const url = req.files['listing[image]'][0].path;
            const filename = req.files['listing[image]'][0].filename;
            images.push({ url, filename });
        } else if (listing.image) {
            images.push(listing.image); // Keep the existing image if no new image is uploaded
        }

        // Handle additional images (listing[image2], listing[image3], ...)
        for (let i = 2; i <= 5; i++) {
            if (req.files && req.files[`listing[image${i}]`]) {
                const url = req.files[`listing[image${i}]`][0].path;
                const filename = req.files[`listing[image${i}]`][0].filename;
                images.push({ url, filename });
            } else if (listing[`image${i}`]) {
                images.push(listing[`image${i}`]); // Keep the existing image if no new image is uploaded
            }
        }

        // Update the images in the listing
        images.forEach((image, index) => {
            const imageField = index === 0 ? 'image' : `image${index + 1}`;
            listing[imageField] = image;
        });

        await listing.save();
    }
    req.flash("success","Hotel Details Updated !")
    res.redirect(`/hotel/${id}`)
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params
    let deletedlisting=await Listing.findByIdAndDelete(id)
    req.flash("success","Hotel Deleted !")
    res.redirect("/")
}

module.exports.ownListing=async(req,res)=>{
    const currUser = req.user; 
    const alllistings = await Listing.find({ owner: currUser._id }).populate('owner').populate('reviews');
    if(alllistings.length === 0){
        req.flash("error","Does not have your own hotel yet !")
         return res.redirect("/")
    }
    alllistings.forEach(listing => {
        const reviews = listing.reviews;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            listing.averageRating = Number.isInteger(averageRating) ? averageRating : averageRating.toFixed(1);
        }
    });
    res.render("listings/index.ejs",{alllistings});
}

module.exports.searchListing=async (req, res) => {
    const { query } = req.query;

  
    const alllistings = await Listing.find({
        $or: [
            { title: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { location: new RegExp(query, 'i') },
         
        ]
    });
    if(alllistings.length === 0){
        req.flash("error","Hotel you searched for does not exist!")
         return res.redirect("/")
    }
    res.render("listings/index.ejs", {alllistings});

    
}