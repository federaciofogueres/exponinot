import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ninot } from '../../models/ninot-model';
import { TipoNinot } from '../../models/tipo-ninot-model';
import { NinotsService } from '../../services/ninots.service';

@Component({
  selector: 'app-ninots',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './ninots.component.html',
  styleUrls: ['./ninots.component.scss']
})
export class NinotsComponent {
  tiposNinots: TipoNinot[] = [
    { id: 0, tipo: 'Foguera adulta', label: 'Adultos' },
    { id: 1, tipo: 'Foguera infantil', label: 'Infantiles' },
    { id: 2, tipo: 'Barraca', label: 'Barracas' },
  ];
  selectedTipoNinot = this.tiposNinots[0].id;
  
  ninots: Ninot[] = [];
  filteredNinots: Ninot[] = [];
  showNinots: Ninot[] = [];
  loading: boolean = false;

  searchTerm: string = '';

  categoria: string = '';
  sort: string = 'num';

  constructor(
    private ninotsService: NinotsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  sortNinots(tipo: string) {
    const categoryOrder: any = {
      'Especial': 1,
      'Primera': 2,
      'Segunda': 3,
      'Tercera': 4,
      'Cuarta': 5,
      'Quinta': 6,
      'Sexta': 7,
      'Sexta A': 7,
      'Sexta B': 8
    };
  
    switch(tipo) {
      case 'cat':
        this.showNinots.sort((a, b) => (categoryOrder[a.categoria] || 10) - (categoryOrder[b.categoria] || 10));
        this.sort = 'cat';
        break;
      case 'alf':
        this.showNinots.sort((a, b) => a.asociacion.localeCompare(b.asociacion));
        this.sort = 'alf';
        break;
      case 'num':
        this.showNinots.sort((a, b) => a.order! - b.order!);
        this.sort = 'num';
        break;
      default:
        break;
    }
  }

  loadData() {
    this.loading = true;
    this.ninotsService.getNinotsWithCache().subscribe({
      next: (ninots) => {
        this.ninots = ninots.sort((a, b) => a.id! - b.id!);
        console.log(this.ninots.sort((a, b) => a.visitas! - b.visitas!));
        
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
    this.router.navigateByUrl(`/ninots/${ninot.id}`);
  }

  updateFilteredNinots(tipoId: number) {
    this.selectedTipoNinot = tipoId;
    this.filteredNinots = this.ninots.filter(ninot => ninot.tipo === tipoId);
    this.showNinots = [...this.filteredNinots];
    if(this.sort === 'cat') this.sortNinots('cat');
  }

  filterNinots() {
    if (this.searchTerm) {
      this.showNinots = this.filteredNinots.filter(ninot => ninot.asociacion.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.showNinots = [...this.filteredNinots];
    }
    this.sortNinots(this.sort);
  }

  showCategoria(ninot: Ninot): boolean {
    if (this.categoria === ninot.categoria) {
      return false;
    } else {
      this.categoria = ninot.categoria;
      return true;
    }
  }

}