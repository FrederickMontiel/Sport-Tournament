import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { GLOBAL } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  public rute: String;
  public token;
  public identity;
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(public _http: HttpClient){
    this.rute = GLOBAL.url
   }

   addTeam(token,team:Team,idUser,idLeague): Observable<any>{
    let params = JSON.stringify(team);
    let headersToken = this.headersVariable.set('Authorization', token)
    return this._http.post(this.rute+'/user/'+idUser+'/league/'+idLeague+'/team',params,{headers: headersToken})
   }
}
