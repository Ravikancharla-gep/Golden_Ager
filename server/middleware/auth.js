const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async(req,res,next) => { 
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        token = req.headers.authorization.split(" ")[1] 
    }
    if(!token){
        return next(new ErrorResponse("Not autherized to access this route", 401));
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.id);

        if(!user){
            return next(new ErrorResponse("No user found", 404));
        }
        req.user = user;

        console.log(user);

        res.status(200).json({
            sucess : true,
            name : user.username,
            email : user.email,
            role : user.role,
            data : `${user.username} have got access to dashboard ! you have assigned to role :${user.role} and now you can see your dashboard`
        })


        // next();

    } catch (error) {
        return next(new ErrorResponse("Not autherized to access this route", 401));
    }
}