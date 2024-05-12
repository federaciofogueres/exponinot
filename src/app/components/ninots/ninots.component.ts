import { Component } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { FirebaseService } from './../../services/firebase.service';
import { NinotsService } from '../../services/ninots.service';
import { Router } from '@angular/router';
import { TipoNinot } from '../../models/tipo-ninot-model';
import { Ninot } from '../../models/ninot-model';

@Component({
  selector: 'app-ninots',
  standalone: true,
  templateUrl: './ninots.component.html',
  styleUrls: ['./ninots.component.scss']
})
export class NinotsComponent {
  tiposNinots: TipoNinot[] = [
    { id: 0, tipo: 'Foguera adulta' },
    { id: 1, tipo: 'Foguera infantil' },
    { id: 2, tipo: 'Barraca' },
  ];
  selectedTipoNinot = this.tiposNinots[0].id;
  
  ninots: Ninot[] = [];
  filteredNinots: Ninot[] = [];
  loading: boolean = false;

  constructor(
    private ninotsService: NinotsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.ninotsService.getNinots().subscribe({
      next: (ninots) => {
        this.ninots = ninots;
        console.log('Ninots:', this.ninots);
        this.updateFilteredNinots(0);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error getting ninots:', error);
        this.loading = false;
      }
    })
  }

  viewNinot(ninot: any) {
    console.log(ninot);
    this.router.navigateByUrl(`/ninots/${ninot.id}`);
  }

  updateFilteredNinots(tipoId: number) {
    this.selectedTipoNinot = tipoId;
    this.filteredNinots = this.ninots.filter(ninot => ninot.tipo === tipoId).sort((a, b) => a.order! - b.order!);
  }

}