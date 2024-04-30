import { Component, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './../environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { NinotsService } from './services/ninots.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firebase-cms';
}