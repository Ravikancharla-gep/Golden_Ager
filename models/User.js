const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type : String,
        required : [true, "Please provide a username"]
    },
    email: {
        type : String,
        required : [true, "Please provide a valid email"]   ,
        unique: true
    },
    password:{
        type : String,
        required : [true, "Please provide a password"],
        minlength : 6,
        select: false
    },
    role:String,
    phone : String,
    resetPasswordToken : String,
    resetPasswordExpire: Date

});

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, {})
}

UserSchema.methods.getResetPasswordToken =  function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 *1000);

    return resetToken ;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;