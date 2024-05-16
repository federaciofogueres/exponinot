import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';


import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { QRModel } from '../../models/qr-model';
import { CookiesComponent } from '../cookies/cookies.component';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scannerEnabled = false;
  audioMode = false;
  isPlaying = false;
  loading = false;

  resultado: QRModel = { tipo: 0, id: 0 };



  userLogged: boolean = false;
  constructor(
    protected router: Router,
    protected authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.userLogged = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }


  
  checkSpeak(){
    if(this.cookieService.get('audioMode') === 'true'){
      this.audioMode = true;
    }
    this.loading = false;
  }

  handleQrCodeResult(resultString: string) {
    console.log('Resultado del escaneo QR: ', resultString);
    let content: QRModel = JSON.parse(resultString);
    
    if (content.tipo !== -1) {
      this.router.navigate(['/ninots', content.id]);
    } else {
      this.playAudio(content.file);
      this.scannerEnabled = false;
    }
  }

  setAudioMode() {
    this.audioMode = !this.audioMode;
    this.cookieService.set('audioMode', this.audioMode.toString());
    this.router.navigate(['/home']);
  }

  enableScanner() {
    this.scannerEnabled = true;
    this.cookieService.set('scannerEnabled', this.scannerEnabled.toString());
    this.router.navigate(['/home']);
  }

  handleQrCodeResultAudioMode(resultString: string) {
    let qrModel: QRModel = JSON.parse(resultString);
    this.resultado = qrModel;
    if (qrModel.tipo === -1) {
      this.playAudio(qrModel.file);
    } else {
      this.router.navigate(['/ninots', qrModel.id]);
    }
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
  }

}
