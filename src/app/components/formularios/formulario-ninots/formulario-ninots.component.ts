import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NinotsService } from '../../../services/ninots.service';
import { Router } from '@angular/router';
import { Asociacion } from '../../../../external-api/asociacion';
import { CensoService } from '../../../services/censo.service';
import { ResponseAsociaciones } from '../../../../external-api/responseAsociaciones';
import { AlertService } from '../../alert/alert.service';
import { TipoNinot } from '../../../models/tipo-ninot-model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-formulario-ninots',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './formulario-ninots.component.html',
  styleUrl: './formulario-ninots.component.scss'
})
export class FormularioNinotsComponent {
  editing: boolean = false;
  ninotForm!: FormGroup;
  asociaciones: Asociacion[] = [];
  categorias: string[] = ['Especial', 'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Sexta A', 'Sexta B'];
  tiposNinots: TipoNinot[] = [
    { id: 0, tipo: 'Foguera adulta' },
    { id: 1, tipo: 'Foguera infantil' },
    { id: 2, tipo: 'Barraca' },
  ];

  constructor(
    private formBuilder: FormBuilder, 
    private ninotsService: NinotsService,
    private router: Router,
    private censoService: CensoService,
    private alertService: AlertService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.loadAsociaciones();
    this.initForm();
  }

  loadAsociaciones() {
    this.censoService.asociacionesGet().subscribe({
      next: (response: ResponseAsociaciones) => {
        if (response.status?.status === 200) {
          this.asociaciones = response.asociaciones!;
        } else {
          //@ts-ignore
          this.alertService.danger('Error loading asociaciones: ', response.status.message);
        }
      },
      error: (error) => {
        this.alertService.danger('Error loading asociaciones: ', error.message);
      }
    });
  }

  handleAsociacion(event: Event) {
    const target = event.target as HTMLSelectElement;
    const asociacionId = target.value;
    console.log('Asociacion id selected -> ', asociacionId);
      
    let asociacion: Asociacion = this.asociaciones.find(asoc => asoc.id === +asociacionId)!;
    console.log('Asociacion selected -> ', asociacion);
    
    this.ninotForm.controls['idAsociacion'].setValue(asociacion.id);
    this.ninotForm.controls['asociacion'].setValue(asociacion.nombre);
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
    let ninot = this.cookieService.get('ninot');
    if (ninot) {
      this.editing = true;
      this.ninotForm.patchValue(JSON.parse(ninot));
    }
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

  limpiar(){
    this.cookieService.delete('ninot');
    this.editing = false;
    this.ninotForm.reset();
  }

}
