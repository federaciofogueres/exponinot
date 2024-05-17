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
  imports: [RouterModule, NgbModule, ZXingScannerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  //Se muestra el escaner
  scannerEnabled = false;
  //Modo audioGuia
  audioMode = false;

  isPlaying = false;
  loading = false;
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
    this.audioMode = this.cookieService.get('audioMode') === 'true';
    this.loading = false;
  }

  // handleQrCodeResultAudioMode(resultString: string) {
  //   let qrModel: QRModel = JSON.parse(resultString);
  //   if (qrModel.tipo === -1) {
  //     this.playAudio(qrModel.file);
  //   } else {
  //     this.router.navigate(['/ninots', qrModel.id]);
  //   }
  // }

  handleQrCodeResult(resultString: string) {
    let content: QRModel = JSON.parse(resultString);

    console.log(content);
    

    if (content.tipo !== -1 && content.id === '') {
      this.router.navigate(['/ninots', 0]);
    }

    if (content.tipo !== -1) {
      this.router.navigate(['/ninots', content.id]);
    } else {
      this.playAudio(content.file);
    }
    
    this.scannerEnabled = this.audioMode;
    // if (!this.audioMode) {
    //   this.scannerEnabled = false;
    // }
  }

  setAudioMode(mode: boolean) {
    this.audioMode = mode;
    this.cookieService.set('audioMode', this.audioMode.toString());
    this.setScanner(mode);
    // if (this.router.url === '/home') {
    //   window.location.reload();
    // }
    // this.router.navigate(['/home']);
  }

  setScanner(mode: boolean) {
    // if(this.scannerEnabled){
    //   this.audioMode = false;
    // }
    this.scannerEnabled = mode;
    // this.cookieService.set('scannerEnabled', this.scannerEnabled.toString());
    // if (this.router.url === '/home') {
    //   window.location.reload();
    // }
    // this.router.navigate(['/home']);
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
