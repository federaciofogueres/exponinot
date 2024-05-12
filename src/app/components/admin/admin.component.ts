import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormularioNinotsComponent } from '../formularios/formulario-ninots/formulario-ninots.component';
import { FormularioTipoNinotComponent } from '../formularios/formulario-tipo-ninot/formulario-tipo-ninot.component';
import { FormsModule } from '@angular/forms';
import { NinotsService } from '../../services/ninots.service';
import { QRService } from '../../services/qr.service';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { Ninot } from '../../models/ninot-model';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormularioNinotsComponent, FormularioTipoNinotComponent, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  showNinotsForm = true;
  @ViewChild('uploadExcel') uploadExcel!: ElementRef;

  constructor(
    private ninotsService: NinotsService,
    private qrService: QRService,
    private alertService: AlertService
  ) {}

  generarQR() {
    console.log('Generar QR');
    this.ninotsService.getNinots().subscribe({
      next: async (response) => {
        let qrPromises = response.map(ninot => 
          this.qrService.generateQRCode({
            tipo: ninot.tipo,
            id: ninot.id
          })
        );

        let qrCodes = await Promise.all(qrPromises);
        
        const zip = new JSZip();
        let index = 0;
        for(const qrCode of qrCodes) {
          const imgData = qrCode.split(',')[1];
          zip.file(`QRCode${index}.png`, imgData, { base64: true });
          index++;
        }
  
        zip.generateAsync({ type: 'blob' }).then((content: any) => {
          saveAs(content, 'QRCodes.zip');
        });

      },error: (error) => {
        console.log('Error -> ', error);
      }
    });
  }

  openUploadDialog() {
    // this.uploadExcel.nativeElement.click();
    this.alertService.warning('Esta funcionalidad está deshabilitada temporalmente');
  }

  downloadExcelTemplate() {
    // Crea un objeto vacío de Ninot.
    let ninot: Ninot = {
      lema: '',
      descripcion: '',
      categoria: '',
      asociacion: '',
      artista: '',
      idAsociacion: null,
      id: '',
      tipo: null,
      boceto: '',
      order: null,
      visitas: 0
    };
  
    // Crea un array con un solo objeto que tiene las claves del objeto ninot como propiedades.
    let data = [ninot];
  
    // Crea una hoja de cálculo con los datos.
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  
    // Crea un libro de trabajo y añade la hoja de cálculo.
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
  
    // Descarga el archivo Excel.
    XLSX.writeFile(wb, 'PlantillaNinot.xlsx');
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('No se puede usar múltiples archivos');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);

      this.processData(data);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  processData(data: any[]) {
    for (let item of data) {
      const ninotData: Ninot = {
        visitas: 0,
        lema: item.lema.toString(),
        descripcion: item.descripcion.toString(),
        categoria: item.categoria.toString(),
        asociacion: item.asociacion.toString(),
        artista: item.artista.toString(),
        idAsociacion: item.idAsociacion,
        id: item.id.toString(),
        tipo: item.tipo,
        boceto: item.boceto.toString(),
        order: item.order
      }
      console.log('Ninot data -> ', ninotData);
      
      this.ninotsService.createNinot(ninotData, ninotData.id).then((result) => {
        console.log('Ninot created successfully -> ', result);
      }).catch((error) => {
        console.log('Error creating ninot -> ', error);
      });
    }
  }
}
