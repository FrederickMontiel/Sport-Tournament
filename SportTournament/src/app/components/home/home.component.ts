import { Component, OnInit } from '@angular/core';
import { League } from 'src/app/models/league.model';
import { LeaguesService } from 'src/app/services/leagues.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LeaguesService, UserService]
})
export class HomeComponent implements OnInit {
  public leagueModel: League;
  public token: String;
  public modelGetLeague: League;
  constructor(
    public _leagueService: LeaguesService,
    public _userService: UserService,
  ){
    this.token = _userService.getToken();
   }

  ngOnInit(): void {
    this.getLeagues();
  }

  getLeagues(){
    this._leagueService.listLeague(this.token, this._userService.getIdentity()._id).subscribe(
      response=>{
        console.log(response.league)
      this.modelGetLeague = response.league;
      }
    )
  }

}
