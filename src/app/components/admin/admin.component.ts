import { Component } from '@angular/core';
import { FormularioNinotsComponent } from '../formularios/formulario-ninots/formulario-ninots.component';
import { FormularioTipoNinotComponent } from '../formularios/formulario-tipo-ninot/formulario-tipo-ninot.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormularioNinotsComponent, FormularioTipoNinotComponent, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  showNinotsForm = true;

  generarQR() {
    console.log('Generar QR');
  }
}
