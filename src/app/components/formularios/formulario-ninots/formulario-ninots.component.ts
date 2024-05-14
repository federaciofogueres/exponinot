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
      boceto: ['', Validators.required],
      ninot: ['', Validators.required],
    });
    let ninot = JSON.parse(this.cookieService.get('ninot'));
    console.log('Ninot -> ', ninot);
    
    if (ninot) {
      this.editing = true;
      this.ninotForm.patchValue(ninot);
      this.ninotForm.controls['idAsociacion'].setValue(ninot.idAsociacion);
      this.ninotForm.controls['asociacion'].setValue(ninot.asociacion);
    }
  }

  saveNinot() {
    const ninotData = this.ninotForm.value;
    ninotData.visitas = 0;
    console.log('Creating ninot -> ', ninotData);
    
    this.ninotsService.createNinot(ninotData, ninotData.id).then((result) => {
      console.log('Ninot created successfully -> ', result);
      this.ninotForm.reset();
    }).catch((error) => {
      console.log('Error creating ninot -> ', error);
    });
  }

  editNinot(ninotId: string) {
    const ninotData = this.ninotForm.value;
    console.log('Updating ninot -> ', ninotData, ninotId);
    
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

  async uploadImage(event: any, field: any) {
    const file = event.target.files[0];
    const tipoNinot = this.ninotForm.get('tipoNinot')?.value;
    let tipoNinotPath = '';
  
    switch(tipoNinot) {
      case 0:
        tipoNinotPath = 'adultos';
        break;
      case 1:
        tipoNinotPath = 'infantiles';
        break;
      case 2:
        tipoNinotPath = 'barracas';
        break;
    }
  
    const idNinot = this.ninotForm.get('id')?.value;
    const filePath = `images/${field}/${tipoNinotPath}/${idNinot}.jpg`;
    let imageUrl = await this.ninotsService.uploadImageNinot(filePath, file, field, this.ninotForm);
    console.log('DATA -> ', imageUrl, field);
    
    this.ninotForm.get(field)?.setValue(imageUrl);
  }

}
