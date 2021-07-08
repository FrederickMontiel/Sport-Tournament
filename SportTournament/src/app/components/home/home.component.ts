import { Component, OnInit } from '@angular/core';
import { League } from 'src/app/models/league.model';
import { Score } from 'src/app/models/score.model';
import { Team } from 'src/app/models/team.model';
import { LeaguesService } from 'src/app/services/leagues.service';
import { ScoreService } from 'src/app/services/score.service';
import { TeamsService } from 'src/app/services/teams.service';
import { UserService } from 'src/app/services/user.service';
import { Columns, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LeaguesService, UserService,TeamsService,ScoreService]
})
export class HomeComponent implements OnInit {
  public leagueModel: League;
  public leagueId: League;
  public teamId: {team};
  public select: any=[];
  public token: String;
  public modelGetLeague: League;
  public teamModel: Team;
  public scoreModel: Score;
  public teamTable: [];
  public temporal;
  constructor(
    public _leagueService: LeaguesService,
    public _userService: UserService,
    public _teamService: TeamsService,
    public _scoreService: ScoreService
  ){
    this.token = _userService.getToken();
    this.leagueId = new League("","","","")
    this.teamModel = new Team("","","","");
    this.scoreModel= new Score("",0,"","",0,"",0)
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

  addScore(){
    this.scoreModel.league = this.leagueId._id
    this._scoreService.addScore(this.token,this.scoreModel,this._userService.getIdentity()._id,this.leagueId._id).subscribe(
      response=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se agrego correctamente el marcador',
          showConfirmButton: false,
          timer: 1500
        });
        this.getTeams(this.leagueId._id)
      },error=>{
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
    this.teamTable = [];
    this._teamService.getTeams(this.token,this._userService.getIdentity()._id,idLeague).subscribe(
      response=>{
        this.teamTable = response.teams;
        //this.teamTable.sort(function(a, b){return a - b});
      }
    )
  }

  cleanArray(){
     this.teamTable.splice(0,this.teamTable.length);
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
        this.teamModel = response.team;
      }
    )
  }

  deleteTeam(){
    this._teamService.deleteTeam(this.token,this._userService.getIdentity()._id,this.teamModel.league,this.teamModel._id).subscribe(
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

  getJourneys(idLeague){
    this.select=[];
    this._teamService.getJourneys(this.token,this._userService.getIdentity()._id,idLeague).subscribe(
      response=>{
        console.log(response.maximo)
        this.temporal = response.maximo;
        for(let i=0; i<this.temporal-1;i++){
          this.select.push(i+1);
        }
        console.log(this.select)
      },
    )
  }

  getTeamUser(idTeam){
    this._teamService.getTeamUser(idTeam).subscribe(
      response=>{
        this.teamModel = response.team

      }
    )
  }

editTeam(){
    this._teamService.editTeam(this.token,this._userService.getIdentity()._id,this.teamModel.league,this.teamModel._id,this.teamModel).subscribe(
      response=>{
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El equipo se edito correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error=>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No se pudo editar',
          showConfirmButton: false,
          timer: 1500
        });
      }
    )
  }

  generarPDF(){
  }
}
