import { Component } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { FirebaseService } from './../../services/firebase.service';
import { NinotsService } from '../../services/ninots.service';
import { Router } from '@angular/router';
import { TipoNinot } from '../../models/tipo-ninot-model';
import { Ninot } from '../../models/ninot-model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ninots',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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
  showNinots: Ninot[] = [];
  loading: boolean = false;

  searchTerm: string = '';

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
        this.ninots = ninots.sort((a, b) => a.id! - b.id!);
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
    this.filteredNinots = this.ninots.filter(ninot => ninot.tipo === tipoId);
    this.showNinots = [...this.filteredNinots];
  }

  filterNinots() {
    if (this.searchTerm) {
      this.showNinots = this.filteredNinots.filter(ninot => ninot.asociacion.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.showNinots = [...this.filteredNinots];
    }
  }

}