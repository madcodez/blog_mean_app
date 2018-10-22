import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  enableComments=[];
  blogs;
  processing: boolean;
  message: any;
  messageClass: string;
  newPost: boolean = false;
  form;
  commentform;
  user: String;
  newComment = [];

  constructor(private fb: FormBuilder, private blogService: BlogService, private authService: AuthService) {
    this.createBlogForm();
    this.createCommentForm();
   
  }

  createBlogForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20), this.alphaNumericValidation])],
      body: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(500)])],

    });
  }
  enableBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }
  disableBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }


  createCommentForm(){
    this.commentform = this.fb.group({
       comment : ['',Validators.compose([Validators.required,Validators.minLength(5),Validators.maxLength(500)])]
    });
  }

  disableCommentForm(){
     this.commentform.get('comment').disable();
  }
  enableCommentForm (){
     this.commentform.get('comment').enable();
 }
  


  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'alphaNumericValidation': true }
    }

  }

  onNewPost() {
    this.newPost = true;
    this.processing = false;
    this.form.reset();
  }

  goBack() {
    window.location.reload();
  }

  submitNewPost() {
    this.processing = false;
    this.disableBlogForm();

    const newBlog = { title: this.form.get('title').value, body: this.form.get('body').value, createdBy: this.user }


    this.blogService.createBlog(newBlog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'
        this.message = data.message;
        this.processing = false;
        this.enableBlogForm();
      } else {
        this.messageClass = 'alert alert-success'
        this.message = data.message;
        setTimeout(() => {
          this.processing = true;
          this.newPost = false;
          this.enableBlogForm();
          this.message = false;
          this.form.reset();
        }, 2000);
        this.getAllBlogs();

      }
    });

  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      //console.log(data.blogs)
      this.blogs = data.blogs;
    })
  }


  onUserlike(id) {
    //console.log(id)
     this.blogService.likeBlog(id).subscribe(data => {
       console.log(data);
     });
  }


  onUserdislike(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      console.log(data);
    });

  }


  onPostComment(id){
    console.log(id);
    this.newComment =[];
    this.newComment.push(id);
  }

  cancelSubmission(id) {
    const index = this.newComment.indexOf(id); 
    this.newComment.splice(index, 1); 
    this.commentform.reset(); 
    this.enableCommentForm(); 
    this.processing = false; 
  }

  onSubmitPost(id){
    this.disableCommentForm(); 
     const comment =this.commentform.get('comment').value;
     this.blogService.postComment(id,comment).subscribe((data)=>{
       console.log(data);
        this.getAllBlogs();
        const index = this.newComment.indexOf(id);
        this.newComment.splice(index,1);
        this.enableCommentForm(); 
        this.commentform.reset();
        if(this.enableComments.indexOf(id) < 0) this.expand(id);


       
     });
  }

  expand(id){
    this.enableComments.push(id);
  }


  collapse(id){
    const index = this.enableComments.indexOf(id) ;
    this.enableComments.splice(index,1);
  }

  ngOnInit() {
  
    this.authService.getProfile().subscribe(data => {
      this.user = data.user.username;

      this.getAllBlogs();


    });


  }


}
