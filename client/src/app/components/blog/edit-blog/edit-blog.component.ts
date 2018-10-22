import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  processing: boolean;
  loading: boolean;
  messageClass: string;
  message: any;
  blog;
  constructor(private blogService : BlogService, private activeRoute : ActivatedRoute, private router : Router) { }
  
  

  ngOnInit() {

        const id =this.activeRoute.snapshot.params.id;

        this.blogService.getSingleBlog(id).subscribe(data => {
          if (!data.success) {
            this.messageClass = 'alert alert-danger'; // Set bootstrap error class
            this.message = data.message; // Set error message
          } else {
            this.blog = data.blog; // Save blog object for use in HTML
            this.loading = false; // Allow loading of blog form
          }
        });



  }

  onSubmitEdit(){
    this.blogService.updateBlog(this.blog).subscribe(data => {

      this.processing = true;
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
       
      }
      else{
          this.messageClass = 'alert alert-success';
          this.message = data.message;
        
        
          setTimeout(()=>{
            this.router.navigate(['/blog']);
          },2000);
      }
    });
  }

}
