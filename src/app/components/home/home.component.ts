import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Router } from '@angular/router';
import { QRModel } from '../../models/qr-model';
import { CookiesComponent } from '../cookies/cookies.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ZXingScannerModule, CookiesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scannerEnabled = false;
  audioMode = false;
  isPlaying = false;

  resultado: string = 'result';

  constructor(protected router: Router) { }

  handleQrCodeResult(resultString: string) {
    console.log('Resultado del escaneo QR: ', resultString);
    let content: QRModel = JSON.parse(resultString);
    
    if (content.tipo === 0) {
      this.router.navigate(['/ninots', content.id]);
    } else {
      // Redirige a otra ruta si 'tipo' no es 0
      // this.router.navigate(['/otra-ruta', content.id]);
    }
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
  }

  handleQrCodeResultAudioMode(resultString: string) {
    console.log('Resultado -> ', resultString);
    this.resultado = resultString;
    this.scannerEnabled = false;
    this.audioMode = false;
    
    // Reproduce un sonido cuando se escanea un código QR
    if (!this.isPlaying) {
      this.isPlaying = true;
      let audio = new Audio();
      audio.src = 'assets/audio/intro.ogg';
      audio.load();
      audio.play();

      audio.onended = () => {
        this.isPlaying = false;
      };
    }
  }

}
