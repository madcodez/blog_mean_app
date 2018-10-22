import { Injectable } from '@angular/core';
import { Http, RequestOptions,Headers } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable()
export class BlogService {


  options;
  constructor(private http : Http, private authService : AuthService) { }



  createAuthorization(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers : new Headers({
        'content-type' : 'application/json',
        'authorization' : this.authService.authToken
      })
    })
  }
  createBlog(newblog){
    
   this.createAuthorization();
    return this.http.post('http://localhost:3000/blogs/create',newblog,this.options).map(res=> res.json())
  }

  getAllBlogs(){
    this.createAuthorization();
    return this.http.get('http://localhost:3000/blogs/getallblogs',this.options).map(res => res.json());
    
  }


  getSingleBlog(id){
    this.createAuthorization();
    return this.http.get('http://localhost:3000/blogs/getBlog/'+id,this.options).map(res=> res.json());
  }

  updateBlog(blog){
    this.createAuthorization();
   
    return this.http.put('http://localhost:3000/blogs/updateBlog/',blog,this.options).map(res=> res.json());
  }

  deleteBlog(id){
    this.createAuthorization();
    return this.http.delete('http://localhost:3000/blogs/deleteBlog/'+id,this.options).map(res => res.json());
  }

  likeBlog(id){
    const blogId = {
      id : id 
    }
    //console.log(blogId);
    this.createAuthorization();
    return this.http.put('http://localhost:3000/blogs/likes/',blogId,this.options).map(res => res.json());
  }
  dislikeBlog(id){
    const blogId = {
      id : id 
    }
    
    this.createAuthorization();
    return this.http.put('http://localhost:3000/blogs/dislikes/',blogId,this.options).map(res => res.json());
  }

  postComment(id,comment){
    const commentData = {
      id : id,
      comment : comment
    }
    this.createAuthorization();
    return this.http.put('http://localhost:3000/blogs/postComment/',commentData,this.options).map(res => res.json());
  }

  

}
