import { Component, OnInit } from '@angular/core';
import { League } from 'src/app/models/league.model';
import { Team } from 'src/app/models/team.model';
import { LeaguesService } from 'src/app/services/leagues.service';
import { TeamsService } from 'src/app/services/teams.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LeaguesService, UserService,TeamsService]
})
export class HomeComponent implements OnInit {
  public leagueModel: League;
  public leagueId: League;
  public teamId: {};
  public token: String;
  public modelGetLeague: League;
  public teamModel: Team;
  public teamTable: [];
  constructor(
    public _leagueService: LeaguesService,
    public _userService: UserService,
    public _teamService: TeamsService
  ){
    this.token = _userService.getToken();
    this.leagueId = new League("","","","")
    this.teamModel = new Team("","","","");
   }

  ngOnInit(): void {
    this.getLeagues();
  }

  getLeagues(){
    this._leagueService.listLeague(this.token, this._userService.getIdentity()._id).subscribe(
      response=>{
      this.modelGetLeague = response.league;
      }
    )
  }

  getLeague(id){
    this._leagueService.getLeague(id).subscribe(
      response=>{
        this.leagueId = response.league;
        this.getTeams(id)
      }
    )
  }

  addTeam(idLeague){
    this._teamService.addTeam(this.token,this.teamModel,this._userService.getIdentity()._id,idLeague).subscribe(
      response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El equipo se creo correctamente',
          showConfirmButton: false,
          timer: 1500
        })
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

  getTeams(idLeague){
    this._teamService.getTeams(this.token,this._userService.getIdentity()._id,idLeague).subscribe(
      response=>{
        this.teamTable = response.teams;
      }
    )
  }

  cleanArray(){
     this.teamTable.splice(0,this.teamTable.length);
  }

  deleteLeague(id){
    this._leagueService.deleteLeague(this.token,this._userService.getIdentity()._id,id).subscribe(
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

  /*getTeam(idLeague,idTeam){
    this._teamService.getTeam(this.token,this._userService.getIdentity()._id,idLeague,idTeam).subscribe(
      response=>{
        console.log(response.team)
      }
    )
  }*/

  getTeam(idLeague,idTeam){
    this._teamService.getTeam(this.token,this._userService.getIdentity()._id,idLeague,idTeam).subscribe(
      response=>{
        this.teamId = response;
        localStorage.setItem('team',JSON.stringify(this.teamId))
      }
    )
  }

  deleteTeam(idLeague,idTeam){
    this._teamService.deleteTeam(this.token,this._userService.getIdentity()._id,idLeague,idTeam).subscribe(
      response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se elimino correctamente',
          showConfirmButton: false,
          timer: 1500
        })
       this.cleanArray()
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
