import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlBase} from "@isc/api/url-base";
import {RestResponse} from "@isc/api/rest-response";

@Injectable({
  providedIn: 'root'
})
export class FolioService {
  private readonly header: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/json'});
  }

  obtenerFolios(filtro: {}) {
    return this.httpClient.get<RestResponse>(UrlBase.folio.filtro, {headers: this.header, params: filtro})
  }

  obtenerPorFolio(folio: string) {
    return this.httpClient.get<RestResponse>(UrlBase.folio.folio, {headers: this.header, params: {folio: folio}})
  }

  registrar(folio) {
    return this.httpClient.post<RestResponse>(UrlBase.folio.guardar, folio, {headers: this.header})
  }
}
