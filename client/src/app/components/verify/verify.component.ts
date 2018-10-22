import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, FormControl,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  messageClass: string;
  message: string;
  form : FormGroup;
  constructor(private fb : FormBuilder,private authService : AuthService, private router : Router) {
    this.form = this.fb.group({
      token : ['', Validators.required],

    });
  }
  enableForm(){
    this.form.controls['token'].enable();
  }
  disableForm(){
    this.form.controls['token'].disable();
  }
  tokenSubmit(){
    let token = {storeToken : this.form.get('token').value};

    this.authService.verify(token).subscribe(data => {
      if(!data.success){
        this.message = data.message;
        this.messageClass = "alert alert-danger";
        this.enableForm();
      }else{
        this.message = data.message;
        this.messageClass = "alert alert-success";
        this.disableForm();

        setTimeout(()=>  this.router.navigate(['/login']) ,2000);
      
      }
    })
  }
  ngOnInit() {
  }

}
