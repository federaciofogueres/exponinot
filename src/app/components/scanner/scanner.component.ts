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

    let content: QRModel = JSON.parse(resultString);
    this.scannerEnabledEvent.emit({ type: 'scanner', mode: false });
    if (content.tipo === -1 && content.id === '') {
      this.goToNinot('0');
    }
    if (content.tipo !== -1) {
      this.goToNinot(content.id as string);
    } else if (content.file) {
      this.playAudio(content.file);
    }
    this.scannerEnabled = this.audioMode;
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
