import { Injectable } from '@angular/core';
import {Http, RequestOptions,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt'


@Injectable()
export class AuthService {
  user: any;
  options: RequestOptions;
  authToken: any;

  constructor( private http : Http) { }

  createAuthorization(){
    this.loadToken();
    this.options = new RequestOptions({
      headers : new Headers({
        'content-type' : 'application/json',
        'authorization': this.authToken
      })
    }) 
  }
  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user){
    return this.http.post('http://localhost:3000/authentication/register',user).map(res => res.json());
  }

  checkUsername(username){
    return this.http.get('http://localhost:3000/authentication/checkusername/'+username).map(res => res.json());
  }
  
  checkEmail(email){
    return this.http.get('http://localhost:3000/authentication/checkemail/'+ email).map(res => res.json());
  }

  login(user){
    return this.http.post('http://localhost:3000/authentication/login',user).map(res => res.json());
  }

  getProfile(){
    this.createAuthorization();
   
    return this.http.get('http://localhost:3000/authentication/profile',this.options).map(res => res.json());
  }

  getPublicProfile(username){
    this.createAuthorization();
    return this.http.get('http://localhost:3000/authentication/publicprofile/'+username,this.options).map(res => res.json());
  }
  verify(token){
        return this.http.post('http://localhost:3000/authentication/verify', token).map(res => res.json());
  }

  logout(){
    this.authToken = null;
    localStorage.clear();
  }
  
  loggedIn() {
    return tokenNotExpired();
  }

  storageToken(token,user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user)); 
    this.authToken = token;
    this.user = user;

  }
}
