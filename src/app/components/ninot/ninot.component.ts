import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NinotsService } from './../../services/ninots.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ninot',
  standalone: true,
  imports: [],
  templateUrl: './ninot.component.html',
  styleUrl: './ninot.component.scss'
})
export class NinotComponent implements OnInit {
  ninot: any;
  loading: boolean = false;
  speaking: boolean = false;
  userLogged: boolean = false;

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
    this.checkSpeak();
  }

  ngAfterViewChecked() {
    // this.checkSpeak();
  }

checkSpeak() {
  if (this.cookieService.get('audioMode') === 'true') {
    this.speak();
  }
}

  checkUser(){
    this.userLogged = this.authService.isLoggedIn();
  }

  async getNinot(id: any) {
    try {
      this.ninot = await this.ninotsService.getNinot(id);
      console.log(this.ninot);
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
    if (!this.speaking) {
      this.speaking = true;
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `Asociación: ${this.ninot.asociacion}. Descripción: ${this.ninot.descripcion}. Categoría: ${this.ninot.categoria}. Lema: ${this.ninot.lema}. Artista: ${this.ninot.artista}.`;
      utterance.onend = () => {
        this.speaking = false;
        if (this.cookieService.get('audioMode') === 'true') {
          this.router.navigate(['/home']);
        }
      };
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

}
