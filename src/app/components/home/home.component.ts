import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Router } from '@angular/router';
import { QRModel } from '../../models/qr-model';
import { CookiesComponent } from '../cookies/cookies.component';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { NinotsService } from '../../services/ninots.service';
import { CarruselComponent } from '../carrusel/carrusel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ZXingScannerModule, CookiesComponent, CommonModule, SpinnerComponent, NgxScannerQrcodeModule, CarruselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scannerEnabled = false;
  audioMode = false;
  isPlaying = false;
  loading = false;

  resultado: QRModel = { tipo: 0, id: 0 };

  constructor(
    protected router: Router,
    private cookieService: CookieService,
    private ninotsService: NinotsService
  ) { }

  ngOnInit() { 
    this.loading = true;
    this.checkSpeak();
    this.checkScanner();
  }

  checkSpeak(){
    if(this.cookieService.get('audioMode') === 'true'){
      this.audioMode = true;
    }
    this.loading = false;
  }

  checkScanner() {
    if (this.cookieService.get('scannerEnabled') === 'true') {
      this.scannerEnabled = true;
    } else if (this.cookieService.get('scannerEnabled') === 'false') {
      this.scannerEnabled = false;
    }
  }

  handleQrCodeResult(resultString: any) {
    console.log('Resultado del escaneo QR: ', resultString);
    let content: QRModel = JSON.parse(resultString);
    
    if (content.tipo !== -1) {
      this.ninotsService.incrementVisits(content.id.toString());
      this.router.navigate(['/ninots', content.id]);
    } else {
      this.playAudio(content.file);
      this.scannerEnabled = false;
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

  handleQrCodeResultAudioMode(resultString: any) {
    let qrModel: QRModel = JSON.parse(resultString);
    this.resultado = qrModel;
    if (qrModel.tipo === -1) {
      this.playAudio(qrModel.file);
    } else {
      this.ninotsService.incrementVisits(qrModel.id.toString());
      this.router.navigate(['/ninots', qrModel.id]);
    }
  }

  playAudio(file?: string) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      let audio = new Audio();
      audio.src = file ? file : 'assets/audio/intro.ogg';
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
    this.cookieService.set('scannerEnabled', 'false');
  }

}
