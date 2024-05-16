import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NinotsService } from './../../services/ninots.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SpinnerComponent } from '../spinner/spinner.component';

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
  contador = 0;

  fotoMode: string = 'boceto';
  flip: string = 'inactive';

  audioMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private ninotsService: NinotsService,
    private cookieService: CookieService,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.getNinot(id);
    this.checkUser();
    console.log('Entro aquí -> ngOnInit');
    
    // this.checkSpeak();
  }

  // ngAfterViewChecked() {
  //   console.log('Entro aquí -> ngAfterViewChecked');
    
  //   // console.log('speaking -> ', this.speaking, this.ninot);
    
  //   if (!this.speaking && this.ninot !== undefined) {
  //     this.checkSpeak();
  //   }
  // }

checkSpeak() {
  if (this.cookieService.get('audioMode') === 'true') {
    this.audioMode = true;
    this.contador++;
    this.speak();
  }
}

  checkUser(){
    this.userLogged = this.authService.isLoggedIn();
  }

  async getNinot(id: any) {
    try {
      this.ninot = await this.ninotsService.getNinot(id);
      // this.ninotsService.incrementVisits(this.ninot.id);
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
        this.router.navigate(['/home']);
      }
    };

    // Ensure the voices are loaded before speaking
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.getVoices().length == 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.speak(utterance);
        };
      } else {
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
