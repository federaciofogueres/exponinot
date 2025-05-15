import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { NinotsService } from '../../services/ninots.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [ZXingScannerModule],
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  @Output() scannerEnabledEvent = new EventEmitter<{ type: string, mode: boolean }>();

  //Se muestra el escaner
  @Input()
  scannerEnabled = false;
  //Modo audioGuia
  @Input()
  audioMode = false;
  isPlaying = false;

  @Output() onBack = new EventEmitter<boolean>();

  constructor(
    protected router: Router,
    protected authService: AuthService,
    private cookieService: CookieService,
    private ninotsService: NinotsService
  ) { }

  handleQrCodeResult(resultString: string) {
    console.log({ resultString });

    let content: any;
    let isUrl = false;
    try {
      content = JSON.parse(resultString);
    } catch {
      console.log('Entro en el catch');

      // Si no es JSON, lo tratamos como URL
      if (resultString.startsWith('http')) {
        console.log('Entro en el startsWith');
        isUrl = true;
        // Extrae el id de la URL si es necesario
        const match = resultString.match(/\/ninots\/(\d+)/);
        const id = match ? match[1] : '0';
        console.log('Nos vamos al id: ', id);

        this.goToNinot(id);
      } else {
        // Otro formato no esperado
        console.warn('Formato de QR no reconocido:', resultString);
        return;
      }
    }

    this.scannerEnabledEvent.emit({ type: 'scanner', mode: false });
    this.scannerEnabled = this.audioMode;

    if (isUrl) {
      return;
    }

    if (content.tipo === -1 && content.id === '') {
      this.goToNinot('0');
    }
    if (content.tipo !== -1) {
      this.goToNinot(content.id as string);
    } else if (content.file) {
      this.playAudio(content.file);
    }
  }

  goToNinot(id: string) {
    this.ninotsService.incrementVisits(id);
    this.router.navigate(['/ninots', id]);
  }

  playAudio(file?: string) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      let audio = new Audio();
      audio.src = file ? file : 'assets/audio/guia-1.mp3';
      audio.load();
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
      };
    }
  }

  back() {
    this.scannerEnabled = false;
    this.audioMode = false;
    this.cookieService.set('audioMode', 'false');
    this.onBack.emit(true);
  }

}
