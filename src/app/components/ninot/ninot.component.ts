import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NinotsService } from './../../services/ninots.service';
import { doc, getDoc } from 'firebase/firestore';

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
  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private ninotsService: NinotsService
  ) {}

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.getNinot(id);
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


  speak() {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `Asociación: ${this.ninot.asociacion}. Descripción: ${this.ninot.descripcion}. Categoría: ${this.ninot.categoria}. Lema: ${this.ninot.lema}. Artista: ${this.ninot.artista}.`;
  
    // Set this.speaking to true when speech starts
    this.speaking = true;
  
    // Set this.speaking to false when speech ends
    utterance.onend = () => {
      this.speaking = false;
    };
  
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    window.speechSynthesis.cancel();
    this.speaking = false;
  }

}
