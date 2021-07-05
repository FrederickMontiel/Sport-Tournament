import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public userModel: User;
  public token;
  public identity;
  constructor(
    private _userService: UserService,
    private _router: Router
  ) {
    this.userModel = new User("","","","","","")
   }
  ngOnInit(): void {
  }

  getToken(){
    this._userService.login(this.userModel, 'true').subscribe(
      response =>{
        this.token = response.token
        localStorage.setItem('token',this.token)
      },
      error =>{
        console.log(<any>error)
      }
    )
  }

  login(){
    this._userService.login(this.userModel).subscribe(
      response=>{
        console.log(response.userFound)
        this.identity = response.userFound;
        localStorage.setItem('identity',JSON.stringify(this.identity))
        this.getToken();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El usuario ingreso correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this._router.navigate(['/myCount'])
      },
      error=>{
        if(error.status === 401){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error.error.message,
            showConfirmButton: false,
            timer: 1500
          })
        }else if(error.status === 500){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error.error.message,
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    )
  }
}
