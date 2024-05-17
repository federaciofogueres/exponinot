import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  // //Se muestra el escaner
  // scannerEnabled = false;
  // //Modo audioGuia
  // audioMode = false;

  // isPlaying = false;
  // loading = false;
  userLogged: boolean = false;

  constructor(
    protected router: Router,
    protected authService: AuthService,
    // private cookieService: CookieService,
    // private ninotsService: NinotsService
  ) {}

  ngOnInit() {
    this.userLogged = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
  
  // checkSpeak(){
  //   this.audioMode = this.cookieService.get('audioMode') === 'true';
  //   this.loading = false;
  // }

  // handleQrCodeResult(resultString: string) {
  //   let content: QRModel = JSON.parse(resultString);
  //   if (content.tipo !== -1 && content.id === '') {
  //     this.router.navigate(['/ninots', 0]);
  //   }
  //   if (content.tipo !== -1) {
  //     this.ninotsService.incrementVisits(content.id as string);
  //     this.router.navigate(['/ninots', content.id]);
  //   } else {
  //     this.playAudio(content.file);
  //   }
  //   this.scannerEnabled = this.audioMode;
  // }

  // setAudioMode(mode: boolean) {
  //   this.audioMode = mode;
  //   this.cookieService.set('audioMode', this.audioMode.toString());
  //   this.setScanner(mode);
  // }

  // setScanner(mode: boolean) {
  //   this.scannerEnabled = mode;
  // }

  // playAudio(file?: string) {
  //   if (!this.isPlaying) {
  //     this.isPlaying = true;
  //     let audio = new Audio();
  //     audio.src = file ? file : 'assets/audio/guia-1.mp3';
  //     audio.load();
  //     audio.play();
  //     audio.onended = () => {
  //       this.isPlaying = false;
  //     };
  //   }
  // }

  // back() {
  //   this.scannerEnabled = false;
  //   this.audioMode = false;
  //   this.cookieService.set('audioMode', 'false');
  // }

}
