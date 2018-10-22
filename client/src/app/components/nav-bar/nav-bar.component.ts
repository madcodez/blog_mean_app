import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
//import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public authService : AuthService,private router : Router) { }

  ngOnInit() {
  }
  onLogoutClick(){
    this.authService.logout();
   // this.flashmessagesService.show('Your are logged out', {cssClass : 'alert alert-info'});
    this.router.navigate(['/']);
  }

}
