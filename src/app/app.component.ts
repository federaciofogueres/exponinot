import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AddsComponent } from "./components/adds/adds.component";
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { QRService } from './services/qr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ScannerComponent, AddsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firebase-cms';

  scannerEnabled = false;
  audioMode = false;

  constructor(
    private qrService: QRService,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef
  ) {
    this.qrService.backEvent$.subscribe({
      next: () => {
        if (this.audioMode) {
          this.scannerEnabled = true;
          this.cd.detectChanges();
        } else {
          this.setOffScanner();
        }
      }
    })
  }

  onScannerEnabled(event: any) {
    if (event.type === 'redirect') {
      this.scannerEnabled = false;
      this.audioMode = false;
    }
    this.scannerEnabled = event.mode;
    if (event.type === 'audio') {
      this.audioMode = event.mode;
      this.cookieService.set('audioMode', this.audioMode.toString());
    }
  }

  setOffScanner() {
    this.scannerEnabled = false;
    this.audioMode = false;
    this.cookieService.set('audioMode', 'false');
  }

}