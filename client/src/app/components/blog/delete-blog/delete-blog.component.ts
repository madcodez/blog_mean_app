import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {
  blog: any;
  messageClass: string;
  message: any;
  urlId;
  processing ;
  foundBlog;
  constructor(private blogService: BlogService, private activeRoute :ActivatedRoute, private router : Router) { }
  


  deleteBlog(){
    this.processing = true;
     this.blogService.deleteBlog(this.urlId).subscribe((data) => {
         
       if(!data.success){
         this.messageClass = 'alert alert-danger';
         this.message = data.message;
       }else{
         this.messageClass = 'alert alert-success';
         this.message = data.message;
         setTimeout(() => {
            this.router.navigate(['/blog']);
         }, 2000);
       }
      });
  }
  ngOnInit() {
    this.urlId = this.activeRoute.snapshot.params['id'];

    this.blogService.getSingleBlog(this.urlId).subscribe((data)=> {
         if(!data.success){
           this.messageClass = 'alert alert-danger';
           this.message = data.message;
         }else{
           this.blog = data.blog;
           this.foundBlog = true;
         }
    })

  }

}
