import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent {
  showCookies = true;

  constructor(
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.checkCookies();
  }

  checkCookies() {
    this.showCookies = this.cookieService.get('cookies') !== 'aceptadas';
  }

  aceptarCookies() {
    this.cookieService.set('cookies', 'aceptadas');
    this.showCookies = false;
  }
}
