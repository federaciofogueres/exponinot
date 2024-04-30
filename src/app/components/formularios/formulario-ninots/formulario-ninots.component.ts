import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NinotsService } from '../../../services/ninots.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-ninots',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './formulario-ninots.component.html',
  styleUrl: './formulario-ninots.component.scss'
})
export class FormularioNinotsComponent {
  ninotForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private ninotsService: NinotsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.ninotForm = this.formBuilder.group({
      lema: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      asociacion: ['', Validators.required],
      artista: ['', Validators.required],
      idAsociacion: ['', Validators.required],
      id: ['', Validators.required],
      tipo: ['', Validators.required],
    });
  }

  saveNinot() {
    const ninotData = this.ninotForm.value;
    this.ninotsService.createNinot(ninotData, ninotData.id).then((result) => {
      console.log('Ninot created successfully -> ', result);
      this.ninotForm.reset();
    }).catch((error) => {
      console.log('Error creating ninot -> ', error);
    });
  }

  editNinot(ninotId: string) {
    const ninotData = this.ninotForm.value;
    this.ninotsService.updateNinot(ninotId, ninotData).then((result) => {
      console.log('Ninot updated successfully -> ', result);
      this.ninotForm.reset();
      this.router.navigateByUrl('/ninots');
    }).catch((error) => {
      console.log('Error updating ninot -> ', error);
    });
  }
}
