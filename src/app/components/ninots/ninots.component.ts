import { Component } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { FirebaseService } from './../../services/firebase.service';
import { NinotsService } from '../../services/ninots.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ninots',
  templateUrl: './ninots.component.html',
  styleUrls: ['./ninots.component.scss']
})
export class NinotsComponent {

  ninots: any[] = [];
  loading: boolean = false;

  constructor(
    private ninotsService: NinotsService,
    private router: Router
  ) {
    this.loading = true;
    this.ninotsService.getNinots().then((ninots) => {
      console.log(ninots);
      this.ninots = ninots;
      this.loading = false;
    }).catch((error) => {
      console.log('Error al obtener los ninots: ', error);
      this.loading = false;
    });
  }

  viewNinot(ninot: any) {
    console.log(ninot);
    this.router.navigateByUrl(`/ninots/${ninot.id}`);
  }
}