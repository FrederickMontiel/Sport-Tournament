import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css'],
  providers: [UserService]
})
export class CountComponent implements OnInit {
  public userIdModel: User;
  public userList;
  constructor(
    public _userService: UserService,
  ) {
    this.userIdModel = new User('','','','','','')
  }


  ngOnInit(): void {
    this.getUsers()
  }

  editUser(){
    this._userService.editUser(this.userIdModel,this.userIdModel._id).subscribe(
      response=>{
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El usuario se edito correctamente',
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.setItem('User',JSON.stringify(this.userIdModel))
        this.getUsers();
      },
      error=>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No se pudo editar',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(this.userIdModel._id)

      }
    )
  }

  ascend(id){
    this._userService.ascendClient(id).subscribe(
      response=>{
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El usuario se ascendio correctamente',
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.setItem('User',JSON.stringify(this.userIdModel))
        this.getUsers();
      },
      error=>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.error.message,
          showConfirmButton: false,
          timer: 1500
        })
        localStorage.setItem('Error',error.message)
      }
    )
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
      console.log(response.usersFound)
      this.userList = response.usersFound
    }),
    error=>{
      console.log(<any>error)
    }
  }

  getUserId(id){
    this._userService.getUser(id).subscribe(
      response =>{
        this.userIdModel = response.userFound;
      }
    )
  }

  deleteUser(id){
    this._userService.deleteUser(id).subscribe(
        response=>{
          console.log(response);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'El usuario se elimino correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          localStorage.setItem('User',JSON.stringify(this.userIdModel))
          this.getUsers();
        },
        error=>{
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

