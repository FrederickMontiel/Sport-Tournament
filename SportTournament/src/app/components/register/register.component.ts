import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[UserService]
})
export class RegisterComponent implements OnInit {
  public userModel: User;
  constructor(
    private _userService: UserService,
    private _router: Router
  ){
    this.userModel = new User("","","","","","")
   }

  ngOnInit(): void {
  }

  register(){
    this._userService.register(this.userModel).subscribe(
      response=>{
        console.log(response)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El usuario se creo correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this._router.navigate(['/login'])
      },
      error =>{
        console.log(<any>error)
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    )
  }

}
