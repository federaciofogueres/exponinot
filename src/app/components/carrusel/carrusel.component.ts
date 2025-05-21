import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [NgbCarouselModule, SpinnerComponent],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss'
})
export class CarruselComponent {
  private static readonly ONE_HOUR = 3600000;

  images = [
    'assets/img/publi/SP1.png',
    'assets/img/publi/SP2.png',
    'assets/img/publi/SP3.jpg',
    'assets/img/publi/SP4.png',
    'assets/img/publi/SP5.png',
    'assets/img/publi/SP6.jpg',
    'assets/img/publi/SP7.png',
    'assets/img/publi/SP8.jpg',
    'assets/img/publi/SP9.jpg',
    'assets/img/publi/SP10.jpg'
  ];
  showCarousel = false;
  slidesView = 0;
  loading = true;

  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    this.initializeCarousel();
  }

  private initializeCarousel() {
    this.loading = true;
    this.showCarousel = false;
    this.loadCarousel();
  }

  private loadCarousel() {
    const lastActivated = this.cookieService.get('carousel');
    const oneHourAgo = Date.now() - CarruselComponent.ONE_HOUR;

    if (!lastActivated || Number(lastActivated) < oneHourAgo) {
      this.activateCarousel();
      this.cookieService.set('carousel', Date.now().toString());
    } else {
      this.deactivateCarousel();
    }
  }

  private activateCarousel() {
    this.showCarousel = true;
    this.loading = false;
  }

  private deactivateCarousel() {
    this.showCarousel = false;
    this.loading = false;
  }

  checkCarousel() {
    this.slidesView++;
    if (this.slidesView >= this.images.length - 1) {
      this.deactivateCarousel();
    }
  }

}
