import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, FormControl,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  previousUrl: any;
  messageClass: string;
  message: string;
  

  form : FormGroup;
  constructor(private fb : FormBuilder,private authService : AuthService, private router : Router,private authGuard : AuthGuard) {
    this.form = this.fb.group({
      username : ['', Validators.required],
      password : ['',Validators.required]
    });
   // console.log(this.form);

  }


  enableForm(){
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }



  disableForm(){
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  onLoginSubmit(){

    const user ={
      username : this.form.get('username').value,
      password : this.form.get('password').value
    }
   // console.log(user);
    this.authService.login(user).subscribe(data => {
      console.log(data);
       if(!data.userActive && typeof data.success == 'undefined'){
        
           
           this.messageClass = 'alert alert-warning';
           this.message = data.message;
           setTimeout(() => { this.router.navigate(['/verify'])},2000);
       
  
       }
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.enableForm();
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.storageToken(data.token,data.user);
        setTimeout(() => {
          if(this.previousUrl){
            this.router.navigate([this.previousUrl]);
          }else{
            this.router.navigate(['/dashboard']);
          }
             
        }, 2000)

        this.disableForm();
      }
    })
  }

  ngOnInit() {

    if(this.authGuard.requestUrl){
           this.messageClass = 'alert alert-danger'; // Set error message: need to login
           this.message = 'You must be logged in to view that page.'; // Set message
     
           this.previousUrl = this.authGuard.requestUrl;
           //console.log(this.previousUrl);
           this.authGuard.requestUrl = undefined;
    }
  }

}
