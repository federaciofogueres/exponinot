import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { Ninot } from '../../models/ninot-model';
import { NinotsService } from '../../services/ninots.service';
import { QRService } from '../../services/qr.service';
import { AlertService } from '../alert/alert.service';
import { FormularioNinotsComponent } from '../formularios/formulario-ninots/formulario-ninots.component';
import { FormularioTipoNinotComponent } from '../formularios/formulario-tipo-ninot/formulario-tipo-ninot.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormularioNinotsComponent, FormularioTipoNinotComponent, FormsModule, SpinnerComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  showNinotsForm = true;
  @ViewChild('uploadExcel') uploadExcel!: ElementRef;
  @ViewChild('uploadBocetos') uploadBocetosInput!: ElementRef;
  loading: boolean = false;

  private ninots: Ninot[] = [];

  constructor(
    private ninotsService: NinotsService,
    private qrService: QRService,
    private alertService: AlertService
  ) {
    this.ninotsService.getNinots().subscribe({
      next: (response) => {
        this.ninots = response;
      }
    })
  }

  generarQR() {
    this.ninotsService.getNinotsWithCache().subscribe({
      next: async (response) => {
        let ninotsIds: string[] = [];
        let qrPromises = response.map(ninot => {
          ninotsIds.push(`${ninot.tipo}-${ninot.order}`);
          return this.qrService.generateQRCode(
            'https://exponinot.hogueras.es/ninots/' + ninot.id
          );
        });

        let qrCodes = await Promise.all(qrPromises);

        const zip = new JSZip();
        let index = 0;
        for (const qrCode of qrCodes) {
          const imgData = qrCode.split(',')[1];
          zip.file(`QRCode-${ninotsIds[index]}.png`, imgData, { base64: true });
          index++;
        }

        zip.generateAsync({ type: 'blob' }).then((content: any) => {
          saveAs(content, 'QRCodes.zip');
        });

      }, error: (error) => {
        console.log('Error -> ', error);
      }
    });
  }

  openUploadDialog() {
    this.uploadExcel.nativeElement.click();
    this.alertService.warning('Esta funcionalidad está deshabilitada temporalmente');
  }

  async downloadExcelTemplate(downloadAllNinots: boolean = false) {
    let ninots: Ninot[] = [];
    if (downloadAllNinots) {
      await new Promise<void>((resolve, reject) => {
        this.ninotsService.getNinotsWithCache().subscribe({
          next: (response) => {
            ninots = response.sort((a, b) => a.id - b.id);
            resolve();
          },
          error: (error) => {
            console.error('Error getting ninots:', error);
            reject(error);
          }
        });
      });
    } else {
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
        visitas: 0,
        ninot: '',
        descripcionAccesible: ''
      };
      ninots.push(ninot);
    }


    // Crea un array con un solo objeto que tiene las claves del objeto ninot como propiedades.
    let data = ninots;

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
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);

      this.loading = true;
      this.processData(data);
      this.loading = false;
    };

    reader.readAsBinaryString(target.files[0]);
  }

  processData(data: any[]) {
    for (let item of data) {
      const ninotData: Ninot = {
        visitas: 0,
        lema: (item.lema?.toString() || ''),
        descripcion: (item.descripcion?.toString() || ''),
        categoria: (item.categoria?.toString() || ''),
        asociacion: (item.asociacion?.toString() || ''),
        artista: (item.artista?.toString() || ''),
        idAsociacion: Number(item.idAsociacion),
        id: (item.id?.toString() || ''),
        tipo: Number(item.tipo),
        boceto: (item.boceto?.toString() || ''),
        order: Number(item.order),
        ninot: (item.ninot?.toString() || ''),
        descripcionAccesible: (item.descripcionAccesible?.toString() || '')
      }
      this.ninotsService.createNinot(ninotData, ninotData.id).then((result) => {
        console.log('Ninot created successfully -> ', result, ninotData);
      }).catch((error) => {
        console.log('Error creating ninot -> ', error);
      });
    }
  }

  async uploadBocetos(event?: any) {
    // Si se llama desde el input file, obtén los archivos del evento
    let files: FileList | null = null;
    if (event && event.target && event.target.files) {
      files = event.target.files;
    } else if (this.uploadBocetosInput && this.uploadBocetosInput.nativeElement.files) {
      files = this.uploadBocetosInput.nativeElement.files;
    }

    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('procesando archivo :', file.name);

      // Extraer tipoNinotPath e idNinot del nombre del archivo (ej: 0-23.png)
      const match = file.name.match(/^(\d+)-(\d+)\./);
      if (!match) {
        console.warn('Nombre de archivo no válido:', file.name);
        continue;
      }
      const tipoNinotPath = match[1] === '0' ? 'adultos' : match[1] === '1' ? 'infantiles' : match[1] === '2' ? 'barracas' : 'otros';
      const idNinot = match[2];
      const currentYear = new Date().getFullYear();
      const filePath = `images/bocetos/${currentYear}/${idNinot}.jpg`;

      // Subir el archivo (puerta)
      const path = await this.ninotsService.uploadImageNinot(filePath, file, 'boceto', null);
      this.addUrlToNinot(Number(match[1]), match[2], path);

    }
  }

  addUrlToNinot(tipoNinot: number, idAsociacion: string, url: string) {
    const ninot = this.ninots.find(ninot => ninot.id === idAsociacion)
    console.log(ninot);
    if (ninot) {
      ninot.boceto = url;
      this.ninotsService.updateNinot(idAsociacion, ninot);
    }

  }
}
