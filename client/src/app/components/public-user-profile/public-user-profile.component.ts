import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-public-user-profile',
  templateUrl: './public-user-profile.component.html',
  styleUrls: ['./public-user-profile.component.css']
})
export class PublicUserProfileComponent implements OnInit {
  message: any;
  messageClass: string;
  paramsUser: any;
  user: any;
  foundUser: boolean;

  constructor(private authService : AuthService ,private activeroute : ActivatedRoute) { }

  ngOnInit() {
      this.paramsUser = this.activeroute.snapshot.params['username'];
      this.authService.getPublicProfile(this.paramsUser).subscribe((data)=>{
        //console.log(data);
        if(!data.success){
          this.messageClass='alert alert-danger';
          this.message = data.message;
        }else{
       
          this.foundUser= true;
          this.user = data.user;
          
       
        }
      });
  }



}
