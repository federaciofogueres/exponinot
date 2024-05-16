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

  images = ['assets/img/sponsors/SP1.png', 'assets/img/sponsors/SP2.png', 'assets/img/sponsors/SP3.png'];
  showCarousel = false;
  slidesView = 0;
  loading = true;

  constructor(private cookieService: CookieService) {}

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
    if (this.slidesView >= this.images.length) {
      this.deactivateCarousel();
    }
  }

}
