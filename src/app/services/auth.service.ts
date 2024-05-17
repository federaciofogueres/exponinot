import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ResponseToken } from '../../external-api/responseToken';
import { Usuario } from '../../external-api/usuario';
import { CensoService } from './censo.service';
import { EncoderService } from './encoder.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private router: Router,
    private censoService: CensoService,
    private encoderService: EncoderService,
    private cookieService: CookieService
  ) { }

  checkToken(): boolean {
    return !this.checkExpireDateToken(this.encoderService.decrypt(this.cookieService.get('token')!))
  }

  checkExpireDateToken(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  saveToken(token: string): void {
    this.cookieService.set('token', this.encoderService.encrypt(token));
  }

  async login(user: string, password: string) {
    let usuario: Usuario = {
      user,
      password: this.encoderService.encrypt(password)
    }
    return new Promise(async (resolve) => {
      this.censoService.doLogin(usuario).subscribe({
        next: (res: ResponseToken) => {
          console.log(res);
          this.saveToken(res.token!);
          resolve(true)
        },
        error: error => {
          console.log(error);
          resolve(true)
        }
      });
    });

  }

  public getToken() {
    let token = '';
    if (this.cookieService.get('token')) {
      token = this.encoderService.decrypt(this.cookieService.get('token')!);
    }
    return token;
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigateByUrl('login');
  }

  isLoggedIn(): boolean {
    const token = this.cookieService.get('token');
    return token !== null && token !== '' ? this.checkToken() : false;
  }
}
