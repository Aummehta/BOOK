const User=require("../models/user");
const ExpressError=require("../utils/ExpressError")
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{let {username,email,password} =req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password)

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to TravelEase");
        res.redirect("/");
    })
   
   }catch(e){
     req.flash("error",e.message)
     res.redirect("/signup")
   }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login=async(req,res)=>{
  
    req.flash("success","Welcome back to TravelEase ! You are logged in")
    let redirectUrl=res.locals.redirectUrl || "/";
    res.redirect(redirectUrl)
    // console.log("Redirecting to this:", res.locals.redirectUrl); 
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out !")
        res.redirect("/")
    })
}