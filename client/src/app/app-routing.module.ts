import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import {AuthGuard} from './guard/auth.guard'
import { NotAuthGuard } from './guard/not-auth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicUserProfileComponent } from './components/public-user-profile/public-user-profile.component';
import { VerifyComponent } from './components/verify/verify.component';

const approutes : Routes =[
    {path : '' ,component : HomeComponent },
    {path : 'register' ,component : RegisterComponent,canActivate : [NotAuthGuard] },
    {path : 'login' ,component : LoginComponent,canActivate : [NotAuthGuard] },
    {path : 'dashboard' ,component : DashboardComponent,canActivate : [AuthGuard] },
    {path : 'profile',component : ProfileComponent,canActivate : [AuthGuard]},
    {path : 'blog',component : BlogComponent , canActivate : [AuthGuard]},
    {path : 'verify',component : VerifyComponent},
    {path : 'edit-blog/:id',component : EditBlogComponent},
    {path : 'delete-blog/:id',component : DeleteBlogComponent},
    {path : 'userprofile/:username',component : PublicUserProfileComponent },
    { path: '**', component: HomeComponent } // "Catch-All" Route
    
];
@NgModule({
    imports : [RouterModule.forRoot(approutes)],
    exports : [RouterModule]
})

export class AppRoutingModule{

}