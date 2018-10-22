const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const randomString = require('randomstring')
const mailer = require('../mailer');



module.exports = (router) => {
    router.post('/register', (req,res)=>{
        console.log(req.body)
       if(!req.body.email){
       
        res.json({success : false , message : "You must provide an email"});
      } else if(!req.body.username){
       
        res.json({success : false , message : "You must provide an username"});
      }else if(!req.body.password){
      
        res.json({success : false , message : "You must provide an password"});
      }else {
         
          let user = new User({
              username : req.body.username.toLowerCase(),
              email : req.body.email.toLowerCase(),
              password : req.body.password,
              storeToken : randomString.generate(),
              active : false
          });
                let mail ={
                    from: 'divakar.manoj@gmail.com',
                    to: user.email,
                    subject: 'Test Mailer',
                    html:` <h3> Hi ,${user.username} </h3>
                            <p> Verify  using : <strong>${user.storeToken}</strong></p>`,
                };
                mailer.transport.sendMail(mail,(error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
          
          user.save(err => {
              if(err){
                 if(err.code === 11000){
                     res.json({success : false,message : "Username and email already exists"})
                 }else if (err.errors){
                     if(err.errors.email){
                         res.json({success : false , message : err.errors.email.message});
                     }else if(err.errors.username){
                         res.json({success : false , message : err.errors.username.message});
                     }else if(err.errors.password){
                        res.json({success : false , message : err.errors.password.message});
                     }else {
                         res.json({success: false , message : err});
                     }
                 }else res.json({sucess: false,message : "Couldn't save user"});
              }else{
                  res.json({success : true , message : 'Account created. Check your email to verify'});
                 
              }
          })
      }
    });

    router.get('/checkusername/:username',(req,res)=>{
       // console.log(req.params.username);
        if(!req.params.username){
           res.json({success : false, message : "Username is not provided"});
        }else{
            User.findOne({username : req.params.username}, (err,user)=>{
                if(err){
                    res.json({success : false, message : err});
                }else{
                    if(user){
                     res.json({success : false , message :"Usename is already taken"});
                    }else{
                        res.json({success : true , message : "Username is available"});
                    }
                }
            });
        }
    });

    router.get('/checkemail/:email', (req,res)=>{
        //console.log(req.params.email);
       if(!req.params.email){
           res.json({success : false , message : "Email is not provided"});
       }else {
           User.findOne({email : req.params.email},(err,email) =>{
                if(err){
                    res.json({success : false, message : err});
                }else{
                    if(email){
                        res.json({success : false, message :"Email is already taken"});
                    }else{
                        res.json({success : true , message:"Email is avaialbe"})
                    }
                    
                }
           });
       } 
    });

    router.post('/login', (req,res)=>{

        
       // console.log(req.headers.origin +'/verify')
    //    res.redirect(req.headers.origin +'/verify');
    //    res.json({success : false, message : 'User not Verified'});
        console.log(req.body)
        if(!req.body.username){
            res.json({success : false, message : 'Username must be provided'});
        }else if(!req.body.password){
            res.json({success : false, message : 'Password must be provided'});
        }else{
            User.findOne({username : req.body.username.toLowerCase()},(err,user)=>{
                  if(err){
                      res.json({success : false , message : err});
                  }else{
                      if(!user){
                          res.json({success : false, message : 'Username not found'});
                      }
                      
                      else{
                       // console.log(User);
                          const validatePassword = user.comparePassword(req.body.password);
                        
                          if(!validatePassword){
                              res.json({success : false , message : 'Password incorrect !'})
                              
                          }else if(!user.active){
                            
                            res.json({ message : 'User not verified. Check your email to verify',userActive : user.active});
                          }else {
                            const token  = jwt.sign({userId : user._id},config.secret,{expiresIn : '24h'});
                            res.json({success : true , token : token, user : user.username, message : 'Success! '});
                          }
                          
                      }
                  }
            })
        }
    });
 
    router.post('/verify', function (req,res){
      // console.log(req.body.storeToken)
        User.findOneAndUpdate({'storeToken': req.body.storeToken},{'$set': {'storeToken' : "",'active' : true }},{'new': true},(err,result)=>{
                                    if (err) {
                                        res.json({ success: false, message: err.message });


                                    } else {
                                        res.json({ success: true, message: 'User Verified'});
                                    }
                                });
                            
                               // res.json({success : true, message : "User Verified"});
                            });
                                        

/* Middle ware - Used to grab user's token from header */


    router.use((req,res,nxt) => {
        //console.log(req.headers);
         const token = req.headers['authorization'];
         if(!token){
            res.json({success : false , message : 'No token provided !'});

         }else{
             jwt.verify(token,config.secret,(err,decoded) => {
                 if(err){
                     res.json({success : false , message : 'Token Invalid :'+ err});
                 }else{
                     req.decoded = decoded ;
                     nxt();
                 }
             })
         }
    });

    router.get('/profile',(req,res)=>{
       // console.log(req.decoded.userId);
        User.findOne({ _id : req.decoded.userId}).select('username email').exec((err,user)=>{
            if(err){
                res.json({success: false , message : err});

            }else{
                if(!user){
                    res.json({success: false , message :'Username is not found' });
                }else{
                    res.json({success : true, user : user});
                }
            }
        })
    });

    router.get('/publicprofile/:username',(req,res)=>{
        if(!req.params.username){
             res.json({success : false , message : 'No username provided' });
        }else{
            User.findOne({username : req.params.username}).select('username email').exec((err,user)=>{
                  if(err){
                      res.json({success : false, message :err});
                  }else{
                      if(!user){
                          res.json({success : false , message : 'No user found'});
                      }else{
                           res.json({success: true, user: user});
                      }
                  }
            });
        }
    });

    
    return router;
}