import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {
    requestUrl ;
    constructor (private authService : AuthService, private router : Router) {
      
     }

    canActivate( route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot) {
      if(this.authService.loggedIn()){
         
           return true;
      }else{
          this.requestUrl = state.url;
          this.router.navigate(['/login']);
          return false
      }
      
    }
  }