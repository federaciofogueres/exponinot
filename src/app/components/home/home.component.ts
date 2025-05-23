import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesComponent } from '../cookies/cookies.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CookiesComponent, CommonModule],
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
