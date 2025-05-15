import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ninot } from '../../models/ninot-model';
import { TipoNinot } from '../../models/tipo-ninot-model';
import { NinotsService } from '../../services/ninots.service';

@Component({
  selector: 'app-ninots',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private normalizeCategoria(cat: string = ''): string {
    return cat
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  sortNinots(tipo: string) {
    const categoryOrder: Record<string, number> = {
      'especial': 1,
      'primera': 2,
      'segunda': 3,
      'tercera': 4,
      'tercera a': 5,
      'tercera b': 6,
      'cuarta': 7,
      'quinta': 8,
      'quinta a': 9,
      'quinta b': 10,
      'sexta': 11,
    };

    switch (tipo) {
      case 'cat':
        this.showNinots.sort((a, b) => {
          const aCat = this.normalizeCategoria(a.categoria);
          const bCat = this.normalizeCategoria(b.categoria);
          const aOrder = categoryOrder[aCat] ?? 99;
          const bOrder = categoryOrder[bCat] ?? 99;
          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }
          return aCat.localeCompare(bCat);
        });
        this.sort = 'cat';
        break;
      case 'alf':
        this.showNinots.sort((a, b) => a.asociacion.localeCompare(b.asociacion));
        this.sort = 'alf';
        break;
      case 'num':
        this.showNinots.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
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
        this.ninots = ninots.sort((a, b) => a.order! - b.order!);
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
    if (this.sort === 'cat') this.sortNinots('cat');
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
    const normalizedCat = this.normalizeCategoria(ninot.categoria);
    if (this.categoria === normalizedCat) {
      return false;
    } else {
      this.categoria = normalizedCat;
      return true;
    }
  }

}