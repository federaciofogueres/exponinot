import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Router } from '@angular/router';
import { QRModel } from '../../models/qr-model';
import { CookiesComponent } from '../cookies/cookies.component';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ZXingScannerModule, CookiesComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scannerEnabled = false;
  audioMode = false;
  isPlaying = false;

  resultado: QRModel = { tipo: 0, id: 0 };

  constructor(
    protected router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() { 
    this.checkSpeak();
  }

  checkSpeak(){
    if(this.cookieService.get('audioMode') === 'true'){
      this.audioMode = true;
    }
  }

  handleQrCodeResult(resultString: string) {
    console.log('Resultado del escaneo QR: ', resultString);
    let content: QRModel = JSON.parse(resultString);
    
    if (content.tipo !== -1) {
      this.router.navigate(['/ninots', content.id]);
    } else {
      // Redirige a otra ruta si 'tipo' no es 0
      // this.router.navigate(['/otra-ruta', content.id]);
    }
  }

  setAudioMode() {
    this.audioMode = !this.audioMode;
    console.log(this.audioMode.toString());
    
    this.cookieService.set('audioMode', this.audioMode.toString());
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
  }

  handleQrCodeResultAudioMode(resultString: string) {
    let qrModel: QRModel = JSON.parse(resultString);
    if (qrModel.tipo === -1) {
      this.playAudio();
    } else {
      this.router.navigate(['/ninots', qrModel.id]);
    }
  }

  playAudio() {
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
