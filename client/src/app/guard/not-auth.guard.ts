import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor (private authService : AuthService, private router : Router) {
      
     }
    canActivate( ) {
      if(!this.authService.loggedIn()){
        return true;
      }else{
        return false
      }
      
    }
  }