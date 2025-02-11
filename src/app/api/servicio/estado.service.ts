import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {of, tap} from "rxjs";
import {UrlBase} from "@isc/api/url-base";
import {RestResponse} from "@isc/api/rest-response";

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private readonly header: HttpHeaders;
  private estados: RestResponse;

  constructor(private httpClient: HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/json'});
  }

  obtenerEstado() {
    return this.estados ? of(this.estados) : this.httpClient.get<RestResponse>(UrlBase.estados, {headers: this.header})
      .pipe(tap(data => this.estados = data));
  }
}
