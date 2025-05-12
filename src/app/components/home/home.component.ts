import { CommonModule } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { Router } from '@angular/router';
import { FfsjLoginComponent, FfsjSpinnerComponent } from 'ffsj-web-components';
import { CarruselComponent } from '../carrusel/carrusel.component';
import { CookiesComponent } from '../cookies/cookies.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CookiesComponent, CommonModule, SpinnerComponent, CarruselComponent, FfsjLoginComponent, FfsjSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  isAppLoaded = false;

  constructor(
    protected router: Router,
    private injector: Injector
  ) { }

  ngDoBootstrap() {
    const el = createCustomElement(FfsjLoginComponent, { injector: this.injector });
    customElements.define('ffsj-login', el);
  }

  manageLogin(event: any) {
    console.log('manageLogin -> ', event);
    
  }

  // ngOnInit() {
  //   setTimeout(() => {
  //     this.isAppLoaded = true;
  //   }, 1000);
  // }

}
