import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { League } from '../models/league.model';
import { GLOBAL } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class LeaguesService {
  public rute : String;
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');
  public token;
  public identidad;
  public dataLeague;
  constructor(public _http : HttpClient) {
    this.rute = GLOBAL.url;
   }

   listLeague(token, id):Observable<any>{
     //console.log("Este es el tok" + token);
     let headersToken = this.headersVariable.set('Authorization',token)
     return this._http.get(this.rute+'user/' + id + '/league',{headers: headersToken})
   }

   addLeague(league:League,token,id):Observable<any> {
    let params = JSON.stringify(league);
    let headersToken = this.headersVariable.set('Authorization', token );
    return this._http.post(this.rute+'user/'+id+'/league',params,{headers: headersToken})
   }

   getLeague(id): Observable<any> {
    return this._http.get(this.rute + 'user/league/'+id,{headers: this.headersVariable})
   }


  editLeague(token,idUser,idLeague,league: League): Observable<any>{
    let params = JSON.stringify(league);
    let headersToken = this.headersVariable.set('Authorization', token );
    return this._http.put(this.rute+'/user/'+idUser+'/league/'+idLeague,params,{headers: headersToken})
  }

  deleteLeague(token,idUser,idLeague): Observable<any> {
    let headersToken = this.headersVariable.set('Authorization', token );
    return this._http.delete(this.rute+'/user/'+idUser+'/league/'+idLeague,{headers: headersToken})
  }


}
