import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { QRService } from '../../services/qr.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NinotsService } from './../../services/ninots.service';

@Component({
  selector: 'app-ninot',
  standalone: true,
  imports: [SpinnerComponent],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(180deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ],
  templateUrl: './ninot.component.html',
  styleUrl: './ninot.component.scss'
})
export class NinotComponent implements OnInit {
  ninot: any;
  loading: boolean = false;
  speaking: boolean = false;
  userLogged: boolean = false;
  hasSpoke: boolean = false;

  fotoMode: string = 'boceto';
  flip: string = 'inactive';

  audioMode: boolean = false;

  idNinot: string = '';

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private ninotsService: NinotsService,
    private cookieService: CookieService,
    protected authService: AuthService,
    private qrService: QRService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      console.log('Params -> ', params['id']);

      console.log('Entro aquí -> ngOnInit', this.router.url);
      
      
      this.idNinot = params['id'];
      this.getNinot(this.idNinot);
    });
    this.checkUser();
    // const id = this.route.snapshot.paramMap.get('id');
    console.log('Entro aquí -> ngOnInit');
  }

  checkSpeak() {
    console.log('Check speak -> ', this.cookieService.get('audioMode') === 'true', !this.hasSpoke, this.hasSpoke);
    
    if (this.cookieService.get('audioMode') === 'true' && !this.hasSpoke) {
      this.audioMode = true;
      this.hasSpoke = true;
      this.speak();
    }
  }

  checkUser(){
    this.userLogged = this.authService.isLoggedIn();
  }

  async getNinot(id: any) {
    try {
      console.log('getting ninot -> ', id);
      
      this.ninot = await this.ninotsService.getNinot(id);
      console.log('getting ninot -> ', this.ninot);
      this.checkSpeak();
      this.loading = false;
    } catch (error) {
      console.error('Error getting ninot:', error);
      this.loading = false;
    }
  }

  edit() {
    this.cookieService.set('ninot', JSON.stringify(this.ninot));
    this.router.navigateByUrl('/admin');
  }

  speak() {
    // Si ya se está hablando, no hagas nada
    console.log('loooog -> ', this.speaking || !this.ninot, this.speaking, !this.ninot);
    
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `Asociación: ${this.ninot.asociacion}. Categoría: ${this.ninot.categoria}. Lema: ${this.ninot.lema}. Artista: ${this.ninot.artista}. Descripción: ${this.ninot.descripcionAccesible !== '' ? this.ninot.descripcionAccesible : 'No tiene descripción.'}.`;

    // Set this.speaking to true when speech starts
    this.speaking = true;
    console.log('Speaking -> ', utterance.text);
    

    // Set this.speaking to false when speech ends
    utterance.onend = () => {
      this.speaking = false;
      if (this.audioMode) {
        // this.router.navigate(['/home']);
        console.log('setting back');
        
        this.qrService.back();
      }
    };

    // Ensure the voices are loaded before speaking
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.getVoices().length == 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } else {
    }
  }

  stopSpeaking() {
    window.speechSynthesis.cancel();
    this.speaking = false;
  }

  deleteNinot() {
    this.ninotsService.deleteNinot(this.ninot.id);
    this.router.navigateByUrl('/ninots');
  }

  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }

}
