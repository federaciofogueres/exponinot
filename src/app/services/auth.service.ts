import { Injectable } from '@angular/core';
import { Usuario } from '../../external-api/usuario';
import { ResponseToken } from '../../external-api/responseToken';
import { Router } from '@angular/router';
import { EncoderService } from './encoder.service';
import { CensoService } from './censo.service';
import { CookieService } from 'ngx-cookie-service';

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

    console.log('Token 2 -> ', token);
    
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      this.cookieService.set('token', this.encoderService.encrypt(token));
    }
  }

  async login(user: string, password: string) {
    let usuario: Usuario = {
      user,
      password: this.encoderService.encrypt(password)
    }
    console.log(this.encoderService.encrypt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5NzYiLCJjYXJnbyI6WzFdLCJpYXQiOjE3MTMzMDQ4MDAwMDB9.E-_fVuq2Wg_Te5R6W5R07QVYkk0XAcV5mljTFBnFjsE'));
    return new Promise(async (resolve, reject) => {
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
    console.log('Sesión cerrada');
    
    this.cookieService.delete('token');
    this.router.navigateByUrl('login');
  }

  isLoggedIn(): boolean {
    const token = this.cookieService.get('token');
    console.log('Checking -> ', token !== null && token !== '');
    
    return token !== null && token !== '' ? this.checkToken() : false;
  }
}
