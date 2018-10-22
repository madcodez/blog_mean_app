const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;




let titleLengthChecker =(title) => {
   if(!title){
       return false;
   }else {
       if(title.length < 3 || title.length > 20){
           return false;
       }else {
           return true
       }
   }
}

let alphanUmbericValidation =(title) => {
    if(!title){
        return false;
    }else {
        const regExp = new RegExp (/^[a-zA-Z0-9]+$/);
        return regExp.test(title);
       
    }
 }

 let bodyLengthChecker =(body)=>{
     if(!body){
         return false;
     }else{
        if(body.length < 5 || body.length > 500){
            return false;
        }else {
            return true
        }
     }
 } 
 const titleValidator = [
    {
        validator : titleLengthChecker,
        message : 'Title must have moret than 3 characters but no more than 20 '
    },
    {
        validator : alphanUmbericValidation,
        message :' Tilte must be aplha-numeric'
    }
 ];
 
 const bodyValidator =[
     {
         validator : bodyLengthChecker,
         message : 'Body must have more than 5 characters but no more than 500'
     },
  
 ];
 const commentValidator = [
   
     {
        validator : bodyLengthChecker,
        message : 'Comment must have more than 5 characters but no more than 500'
     }
 ];

const blogSchema = new Schema({
    title : {type: String, required: true,validate : titleValidator},
    body : {type : String,required: true,validate : bodyValidator},
    createdBy:{type: String},
    createdOn : {type : Date, default : Date.now()},
    likes : {type : Number,default : 0},
    likedBy : {type : Array},
    dislikes :{type: Number, default : 0},
    dislikedBy : {type: Array},
    comments:[{
        comment :{type : String,validate : commentValidator},
        commentator: {type : String}
    }]
});
module.exports = mongoose.model('Blog',blogSchema);