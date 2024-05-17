import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarruselComponent } from '../carrusel/carrusel.component';
import { CookiesComponent } from '../cookies/cookies.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CookiesComponent, CommonModule, SpinnerComponent, CarruselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    protected router: Router
  ) { }

  ngOnInit() { 
  }

}
