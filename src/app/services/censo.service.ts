import { HttpResponse, HttpEvent, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../../external-api/configuration';
import { ResponseToken } from '../../external-api/responseToken';
import { Usuario } from '../../external-api/usuario';
import { ResponseAsociaciones } from '../../external-api/responseAsociaciones';

@Injectable({
  providedIn: 'root'
})
export class CensoService {

  protected basePath = 'https://censo-api.hogueras.es/emjf1/Censo-Hogueras/1.0.0';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    private httpClient: HttpClient
  ) { 
    
  }

  /**
   * Listar todas las asociaciones
   * 
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public asociacionesGet(observe?: 'body', reportProgress?: boolean): Observable<ResponseAsociaciones>;
  public asociacionesGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseAsociaciones>>;
  public asociacionesGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseAsociaciones>>;
  public asociacionesGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    let headers = this.defaultHeaders;

    // authentication (BearerAuth) required
    if (this.configuration.accessToken) {
        const accessToken = typeof this.configuration.accessToken === 'function'
            ? this.configuration.accessToken()
            : this.configuration.accessToken;
        headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
        'application/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
        headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.request<ResponseAsociaciones>('get',`${this.basePath}/asociaciones`,
        {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        }
    );
  }

  /**
   * Realizar la autentificación del usuario
   * 
   * @param body 
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public doLogin(body: Usuario, observe?: 'body', reportProgress?: boolean): Observable<ResponseToken>;
  public doLogin(body: Usuario, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseToken>>;
  public doLogin(body: Usuario, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseToken>>;
  public doLogin(body: Usuario, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    let headers = this.defaultHeaders;

    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
        headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
        'application/json'
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
        headers = headers.set('Content-Type', httpContentTypeSelected);
    }
    return this.httpClient.request<ResponseToken>('post',`${this.basePath}/login`,
      {
          body: body,
          withCredentials: this.configuration.withCredentials,
          headers: headers,
          observe: observe,
          reportProgress: reportProgress
      }
    );
  }
    
}
