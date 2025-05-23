import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-adds',
  standalone: true,
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.scss']
})
export class AddsComponent implements OnInit, OnDestroy {
  images: string[] = [
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

  currentIndex = 0;
  closed = false;
  private imageInterval: any;
  private resetInterval: any;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    this.startAdds();

    // Reinicia el ciclo completo (anuncios reaparecen) cada 15 segundos
    this.ngZone.runOutsideAngular(() => {
      this.resetInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.resetAdds();
        });
      }, 5 * 60 * 1000);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.imageInterval);
    clearInterval(this.resetInterval);
  }

  private startAdds(): void {
    this.closed = false;
    this.currentIndex = 0;

    this.ngZone.runOutsideAngular(() => {
      this.imageInterval = setInterval(() => {
        this.ngZone.run(() => {
          if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
          } else {
            this.closed = true;
            clearInterval(this.imageInterval);
          }
        });
      }, 2000);
    });
  }

  private resetAdds(): void {
    clearInterval(this.imageInterval);
    this.startAdds();
  }

  closeAdds(): void {
    this.closed = true;
    clearInterval(this.imageInterval);
  }
}
