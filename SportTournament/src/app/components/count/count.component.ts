import { Component, OnInit } from '@angular/core';
import { League } from 'src/app/models/league.model';
import { User } from 'src/app/models/user.model';
import { LeaguesService } from 'src/app/services/leagues.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css'],
  providers: [UserService,LeaguesService]
})
export class CountComponent implements OnInit {
  public userIdModel: User;
  public leagueId: League;
  public userList;
  public leagueList:{};
  public token: String;
  constructor(
    public _userService: UserService,
    public _leagueService: LeaguesService
  ) {
    this.token = _userService.getToken();
    this.userIdModel = new User('','','','','','');
    this.leagueId = new League('','','','')
  }


  ngOnInit(): void {
    this.getUsers()
    this.getLeagues()
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

  getLeagues(){
    this._leagueService.getLeagues(this.token).subscribe(
      response=>{
        this.leagueList = response.ligas
      }
    )
  }

  getLeague(id){
      this._leagueService.getLeague(id).subscribe(
        response=>{
          this.leagueId = response.league;
        }
      )
  }

  editLeague(){
    this._leagueService.editLeague(this.token,this._userService.getIdentity()._id,this.leagueId._id,this.leagueId).subscribe(
      response=>{
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'La liga se edito correctamente',
          showConfirmButton: false,
          timer: 1500
        });
        this.getLeagues();
      },
      error=>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No se pudo editar',
          showConfirmButton: false,
          timer: 1500
        })
      }
    )
  }

  deleteLeague(){
    this._leagueService.deleteLeague(this.token,this._userService.getIdentity()._id,this.leagueId._id).subscribe(
      response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se elimino correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this.getLeagues()
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
