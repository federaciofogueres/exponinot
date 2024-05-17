import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TiposNinotsService } from '../../../services/tipos-ninots.service';

@Component({
  selector: 'app-formulario-tipo-ninot',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './formulario-tipo-ninot.component.html',
  styleUrl: './formulario-tipo-ninot.component.scss'
})
export class FormularioTipoNinotComponent {
  tipoNinotForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private tiposNinotsService: TiposNinotsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.tipoNinotForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      id: ['', Validators.required]
    });
  }

  saveTipoNinot() {
    const tipoNinotData = this.tipoNinotForm.value;
    this.tiposNinotsService.createTipoNinot(tipoNinotData, tipoNinotData.id.toString()).then((result) => {
      console.log('Ninot created successfully -> ', result);
      this.tipoNinotForm.reset();
    }).catch((error) => {
      console.log('Error creating ninot -> ', error);
    });
  }

  editTipoNinot(tipoNinotId: string) {
    const tipoNinotData = this.tipoNinotForm.value;
    this.tiposNinotsService.updateTipoNinot(tipoNinotId, tipoNinotData).then((result) => {
      console.log('Ninot updated successfully -> ', result);
      this.tipoNinotForm.reset();
      this.router.navigateByUrl('/ninots');
    }).catch((error) => {
      console.log('Error updating ninot -> ', error);
    });
  }
}
