import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { QRService } from './services/qr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ScannerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firebase-cms';

  scannerEnabled = false;
  audioMode = false;

  constructor(
    private qrService: QRService
  ){
    this.qrService.backEvent$.subscribe({
      next: () => {
        if(this.audioMode) {
          this.scannerEnabled = false;
        } else{
          this.setOffScanner();
        }
      }
    })
  }

  onScannerEnabled(event: any) {
    console.log('Scanner enabled', event);
    if (event.type === 'redirect') {
      this.scannerEnabled = false;
      this.audioMode = false;
    }
    this.scannerEnabled = event.mode;
    if(event.type === 'audio') {
      this.audioMode = event.mode;
    }
  }

  setOffScanner() {
    this.scannerEnabled = false;
    this.audioMode = false;
  }

}