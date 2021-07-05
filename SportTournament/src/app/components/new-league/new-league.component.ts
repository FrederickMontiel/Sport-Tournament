import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { League } from 'src/app/models/league.model';
import { LeaguesService } from 'src/app/services/leagues.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-league',
  templateUrl: './new-league.component.html',
  styleUrls: ['./new-league.component.css'],
  providers: [LeaguesService, UserService]
})
export class NewLeagueComponent implements OnInit {
  public leagueModel: League;
  public token;
  constructor(
    private _leagueService: LeaguesService,
    private _userService: UserService,
    private _router: Router
  ) {
    this.leagueModel = new League("","");
    this.token = this._userService.getToken();

   }

  ngOnInit(): void {
  }

  addLeague(){
    this._leagueService.addLeague(this.leagueModel,this.token,this._userService.getIdentity()._id).subscribe(
      response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'La liga se creo correctamente',
          showConfirmButton: false,
          timer: 1500
        })
      },
      error=>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'error',
          showConfirmButton: false,
          timer: 1500
        })
      }
    )
  }

}
