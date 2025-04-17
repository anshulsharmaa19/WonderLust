const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        // saving the last path of the url which we want to go.
        req.session.redirectUrl = req.originalUrl;
       req.flash("error", "You must be logged in to create listing!");
       return res.redirect("/login");
   }
   next();
}


// save the redirectUrl in locals 
// bcz the passport will delete all the session 
// when the user logged in but passport have not access to delete locals.
module.exports.saveRedirectUrl = (req,res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id);
    if(!listings.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listings!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
    throw new expressError(404,errMsg);
}else{
    next();
}
};


module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
    throw new expressError(404,errMsg);
}else{
    next();
}
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
