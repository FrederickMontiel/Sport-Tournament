import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [UserService]
})
export class NavbarComponent implements OnInit {
  public identity;
  public token;
  constructor(
    public _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  singOff(){
    localStorage.clear();
    this.identity = null;
    this.token =null;
    this._router.navigate(['/login'])
  }

}
