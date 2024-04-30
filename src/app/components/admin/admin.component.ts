import { Component } from '@angular/core';
import { FormularioNinotsComponent } from '../formularios/formulario-ninots/formulario-ninots.component';
import { FormularioTipoNinotComponent } from '../formularios/formulario-tipo-ninot/formulario-tipo-ninot.component';
import { FormsModule } from '@angular/forms';
import { NinotsService } from '../../services/ninots.service';
import { QRService } from '../../services/qr.service';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormularioNinotsComponent, FormularioTipoNinotComponent, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  showNinotsForm = true;

  constructor(
    private ninotsService: NinotsService,
    private qrService: QRService
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
}
