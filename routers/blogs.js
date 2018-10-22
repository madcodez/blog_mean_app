const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = (router) => {
    router.post('/create', (req, res) => {

        //console.log(req.body);
        if (!req.body.title) {
            res.json({ success: false, message: 'Blog title is required ' });
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: 'Body is required' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Created by is required' })
                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    //console.log(blog)
                    blog.save((err) => {
                        if (err) {
                            if (err.errors) {
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        res.json({ success: false, message: err });
                                    }
                                }
                            } else {
                                res.json({ success: false, meesage: err });
                            }


                        } else {
                            res.json({ success: true, message: 'Blog Saved' });
                        }
                    })
                }
            }
        }
    })

    router.get('/getallblogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!blogs) {
                    res.json({ successs: false, message: "No blogs found" });
                } else {
                    res.json({ success: true, blogs: blogs });
                }
            }

        }).sort({ _id: -1 });
    });

    router.get('/getblog/:id', (req, res) => {
        //res.send(req.decoded.userId);
        if (!req.params.id) {
            res.json({ success: false, message: 'No blog id provided' });

        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'No blog found' });
                    } else {
                        User.findOne({_id : req.decoded.userId},(err,user)=>{
                            if(err){
                                res.json({success : false, message :err});
                            }else{
                                if(!user){
                                    res.json({ success: false, message: 'Unable to authenticate user.' });   
                                }else{
                                    if(!user.username === blog.createdBy){
                                        res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); 
                                    }else{
                                        res.json({success : true , blog : blog});
                                    }

                                }
                            }
                        });
                        //res.json({ success: true, blog: blog });
                    }
                }
            })
        }
    });

    router.put('/updateBlog/', (req, res) => {

        if (!req.body._id) {
            res.json({ success: false, message: 'No blog id is provided' });

        } else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {

                    res.json({ success: false, message: 'Not a valid blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'No blog found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.josn({ success: false, message: 'Unable to authenticate user' })
                                } else {
                                    if (!user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this blog post' });
                                    } else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body;
                                        blog.save((err) => {
                                            if (err) {
                                                if (err.errors) {
                                                    if (err.errors.title) {
                                                        res.json({ success: false, message: err.errors.title.message });
                                                    } else {
                                                        if (err.errors.blog) {
                                                            res.json({ success: false, message: err.errors.body.message });
                                                        }
                                                    }
                                                } else {
                                                    res.json({ sucess: false, message: "Couldn't save blog" });
                                                }
                                            } else {
                                                res.json({ success: true, message: 'Blog Updated' });
                                            }
                                        });

                                    }
                                }
                            }
                        });

                    }
                }


            })
        }
    })
    router.delete('/deleteBlog/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No id is provided' });
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'No blog found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.josn({ success: false, message: 'Unable to authenticate user' })
                                } else {
                                    if (!user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this blog post' });
                                    } else {
                                        blog.remove((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err }); // Return error message
                                            } else {
                                                res.json({ success: true, message: 'Blog deleted!' }); // Return success message
                                            }
                                        });

                                    }

                                }

                            }
                        });
                    }
                }
            });
        }
    });

    router.put('/likes/',(req,res)=>{
       if(!req.body.id){
           res.json({success : false , message:'No id is provided'});
       }else{
           Blog.findOne({_id : req.body.id},(err,blog)=>{
               if(err){
                     res.json({success : false , message: err});
               }else{
                   if(!blog){
                       res.json({success : false , message: 'No blog found'});
                   }else{
                      // res.send(blog);
                       User.findOne({_id : req.decoded.userId},(err,user)=>{
                        if(err){
                            res.json({success : false , message: err});
                      }else{
                           if(user.username === blog.createdBy){
                               res.json({success: false , message : 'You are not allowed to like or dislike your post'});
                           }else{
                               if(blog.likedBy.includes(user.username)){
                                   res.json({success : false , message : 'You already liked the post' });
                               }else{
                                if(blog.dislikedBy.includes(user.username)){
                                    const userIndex = blog.dislikedBy.indexOf(user.username) ;
                                    blog.dislikedBy.splice(userIndex,1);
                                    blog.dislikes--;
                                    blog.likedBy.push(user.username);
                                    blog.likes++;
                                    blog.save((err)=>{
                                        if(err){
                                            res.json({succes: false,  message : err});
                                        }else{
                                            res.json({success : false , message : 'Blog is liked'});
                                        }
                                    });
                                }else{
                                    blog.likedBy.push(user.username);
                                    blog.likes++;
                                    blog.save((err)=>{
                                        if(err){
                                            res.json({succes: false,  message : err});
                                        }else{
                                            res.json({success : false , message : 'Blog is liked'});
                                        }
                                    });
                                  
                                }

                               }
                           
                           }

                          }
                       });

                   }
                   
               }
           })
       }
    });


    router.put('/dislikes/',(req,res)=>{
        if(!req.body.id){
            res.json({success : false , message:'No id is provided'});
        }else{
            Blog.findOne({_id : req.body.id},(err,blog)=>{
                if(err){
                      res.json({success : false , message: err});
                }else{
                    if(!blog){
                        res.json({success : false , message: 'No blog found'});
                    }else{
                       // res.send(blog);
                        User.findOne({_id : req.decoded.userId},(err,user)=>{
                         if(err){
                             res.json({success : false , message: err});
                       }else{
                            if(user.username === blog.createdBy){
                                res.json({success: false , message : 'You are not allowed to like or dislike your post'});
                            }else{
                                if(blog.dislikedBy.includes(user.username)){
                                    res.json({success : false , message : 'You already liked the post' });
                                }else{
                                 if(blog.likedBy.includes(user.username)){
                                     const userIndex = blog.likedBy.indexOf(user.username) ;
                                     blog.likedBy.splice(userIndex,1);
                                     blog.likes--;
                                     blog.dislikedBy.push(user.username);
                                     blog.dislikes++;
                                     blog.save((err)=>{
                                         if(err){
                                             res.json({succes: false,  message : err});
                                         }else{
                                             res.json({success : false , message : 'Blog is disliked'});
                                         }
                                     });
                                 }else{
                                     blog.dislikedBy.push(user.username);
                                     blog.dislikes++;
                                     blog.save((err)=>{
                                         if(err){
                                             res.json({succes: false,  message : err});
                                         }else{
                                             res.json({success : false , message : 'Blog is disliked'});
                                         }
                                     });
                                   
                                 }
 
                                }
                            
                            }
 
                           }
                        });
 
                    }
                    
                }
            })
        }
     });

     router.put('/postcomment',(req,res)=>{
         if(!req.body.id){
             res.json({success: false, message : 'No blog id provided'});
         }else{
             Blog.findOne({_id : req.body.id},(err,blog)=>{
                 if(err){
                     res.json({success: false,message : err});
                 }else{
                     if(!blog){
                         res.json({success: false , message : 'No blog found' });
                     }else{
                         User.findOne({_id: req.decoded.userId},(err,user)=>{
                             if(err){
                                 res.json({success: false , message : err});
                             }else{
                                 if(!user){
                                     res.json({success: false , message : 'No user found'})
                                 }else{
                                    blog.comments.push({
                                        comment : req.body.comment,
                                        commentator : user.username
                                    });
                                    blog.save(err =>{
                                        if(err){
                                            res.json({success : false , message : err});
                                        }else{
                                           res.json({success : true , message : ' Comment Saved'});
                                        }
                                    });

                                 }
                             }
                         })
                   
                 
                     }
                 }
             })
         }
     });

    return router;
}