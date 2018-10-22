const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema; 




let validUsername = (username)=>{
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

let usernameLengthCheck = (username) => {
    if(!username){
        return false;
    }else{
        if(username.length < 3 || username.length > 15 ){
            return false;
        }else {
            return true;
        }
    }
}
const usernameValidator = [
    {validator : validUsername , message : 'Username must not have any special character'},
    {validator : usernameLengthCheck , message : 'Username must be at least 3 character but no more than 15 '}
]



let validEmail = (email) => {
     if(!email){
         return false;
     }else{
         const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
         return regExp.test(email);
     }

};

let emailLengthCheck  =(email)=>{
    if(!email){
        return false;
    }else{
        if(email.length < 5 || email.length > 30 ){
            return false;
        }else{
            return true;
        }
    }
}
const emailValidator = [
    {validator : validEmail , message : 'Must be valid email'},
    {validator : emailLengthCheck, message : 'Email length must be atleast 5 characters but not morethan 30 characters'}
];

 

let validPassword = (password) => {
    if(!password){
        return false;
    }else{
        const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[#$^+=!*()@%&]).{8,35}$/);
        //console.log( regExp.test(password));
        return regExp.test(password);
    }
};

let passwordLengthCheck = (password)=>{
    if(!password){
        return false;
    }else{
       if(password.length < 8 || password.length > 35){
           return false;
       }else{
           return true;
       }
    }
}

const passwordValidator =[
    {validator :  validPassword , message : 'Password must have at least one uppercase, lowercase, special character, and number'},
    
    {validator : passwordLengthCheck , message : 'Password must be at least 8 characters but no more than 35'},
   
];

const userSchema =new Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true,validate : usernameValidator },
        email: { type: String, required: true, unique: true, lowercase: true , validate : emailValidator },
        password: { type: String, required: true ,validate : passwordValidator },
        storeToken : { type : String},
        active : { type  : Boolean}
    }
);

userSchema.pre('save',function(next){
    let user = this;
    if(!this.isModified('password')) return next();

    bcrypt.hash(user.password,null,null,function(err,hash){
        if(err) return next(err);
        user.password = hash;
       
        next();
    });
});

userSchema.methods.comparePassword = function(password){
    let user = this;
    return bcrypt.compareSync(password,user.password);
}

module.exports = mongoose.model('User', userSchema);