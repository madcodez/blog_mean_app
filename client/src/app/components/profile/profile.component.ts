import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email ;
  username ;
  constructor(private authService : AuthService) { }

  ngOnInit() {

     this.authService.getProfile().subscribe(data => {
        console.log(data);
        this.email = data.user.email;
        this.username = data.user.username;
     });
  }

}
