import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CookieService } from 'ngx-cookie-service';
import { QRModel } from '../../models/qr-model';
import { AuthService } from '../../services/auth.service';
import { NinotsService } from '../../services/ninots.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [ZXingScannerModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss'
})
export class ScannerComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

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
  ) {}

  handleQrCodeResult(resultString: string) {
    let content: QRModel = JSON.parse(resultString);

    console.log('QR content -> ', content);
    
    if (content.tipo !== -1 && content.id === '') {
      this.router.navigate(['/ninots', 0]);
    }
    if (content.tipo !== -1) {
      this.ninotsService.incrementVisits(content.id as string);
      this.router.navigate(['/ninots', content.id]);
    } else {
      this.playAudio(content.file);
    }
    this.scannerEnabled = this.audioMode;
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
