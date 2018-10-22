import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  emailMessage: any;

  emailValid: boolean = true;
  usernameValid: boolean = true;
  usernameMessage: any;
  messageClass: string
  message : string;
  form  : FormGroup;
  processing: boolean= false;


  constructor( private fb : FormBuilder,
      private authService : AuthService,
      private route : ActivatedRoute,
      private router : Router) {
    this.createForm();
   }

   createForm(){
    this.form = this.fb.group({
      username : ['',Validators.compose(
        [ 
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          this.validateUsername
        ])],
      email : ['',Validators.compose(
        [ 
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          this.validateEmail
        ])],
      password : ['',Validators.compose(
        [ 
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePassword
        ])],
      cpassword : ['',Validators.required]

    },{validator : this.matchingPassword('password' ,'cpassword')})

  }

 
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['cpassword'].disable();
  }
  
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['cpassword'].enable();
  }


  validateUsername = (controls) =>{
     var regExp = new RegExp(/^[a-zA-Z0-9]+$/);

     if(regExp.test(controls.value)){
        return null;
     }
     return { validateUsername : true};
  }

  validateEmail = (controls)=> {
    const regExp= new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
   }
   return { validateEmail : true};
  }

  validatePassword = (controls)=> {
    const regExp= new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if(regExp.test(controls.value)){
      return null;
   }
   return { validatePassword : true};
  }


  matchingPassword = (password,cpassword) => {
    return (group : FormGroup) =>{

      if(group.controls[password].value === group.controls[cpassword].value ){
        return null;
      }
      return {matchingPassword : true};
    }
  }

  onRegister(){
        this.processing = true;
        this.disableForm();

        const user = {
              username : this.form.get('username').value,
              email : this.form.get('email').value,
              password : this.form.get('password').value
        }


    this.authService.registerUser(user)
        .subscribe((data : any) => {
          if(!data.success){
            this.messageClass= 'alert alert-danger';
            this.message = data.message;
            this.processing = false;
            this.enableForm();
          }else{
            this.messageClass= 'alert alert-success';
            this.message = data.message;

            setTimeout(() => {
                this.router.navigate(['/verify']);
            },2000);
          // this.disableForm();
          //  this.createForm();

          }
        });
    
  }

  checkUsername(){
   
    this.authService.checkUsername(this.form.get('username').value)
                    .subscribe(data => {
                                if(!data.success){
                                  
                                  this.usernameValid = false;
                                  this.usernameMessage = data.message;
                                }else{
                                  this.usernameValid = true;
                                  this.usernameMessage = data.message;
                                }
                              });
  }

  checkEmail(){

    this.authService.checkEmail(this.form.get('email').value)
                    .subscribe(data => {
                                        if(!data.success){
                                          this.emailValid = false;
                                          this.emailMessage = data.message;
                                        }else{
                                          this.emailValid = true;
                                          this.emailMessage=data.message;
                                        }
                                      });
  }
 
  ngOnInit() {
  }
}
