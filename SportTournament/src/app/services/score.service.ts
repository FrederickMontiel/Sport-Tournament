import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global.service';
import { Score } from '../models/score.model';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  public rute: String;
  public token;
  public identity;
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(public _http: HttpClient){
    this.rute = GLOBAL.url
   }


   addScore(token,score:Score,idUser,idLeague):Observable<any>{
    let params = JSON.stringify(score);
    let headersToken = this.headersVariable.set('Authorization',token)
    return this._http.post(this.rute + '/user/'+idUser+'/league/'+idLeague+'/score',params,{headers: headersToken})
   }
}
