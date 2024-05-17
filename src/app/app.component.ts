import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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
    private qrService: QRService,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef
  ){
    this.qrService.backEvent$.subscribe({
      next: () => {
        console.log('setting back 3', this.audioMode, this.scannerEnabled);
        if(this.audioMode) {
          this.scannerEnabled = true;
          this.cd.detectChanges();
          console.log('setting back 4', this.audioMode, this.scannerEnabled);
          
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
      this.cookieService.set('audioMode', this.audioMode.toString());
    }
  }

  setOffScanner() {
    console.log('Scanner disabled 1', this.scannerEnabled, this.audioMode, this.cookieService.get('audioMode'));
    this.scannerEnabled = false;
    this.audioMode = false;
    this.cookieService.set('audioMode', 'false');
    console.log('Scanner disabled', this.scannerEnabled, this.audioMode, this.cookieService.get('audioMode'));
    
  }

}