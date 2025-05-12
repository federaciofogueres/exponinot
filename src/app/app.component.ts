import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BlockComponent } from './components/block/block.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { NinotsService } from './services/ninots.service';
import { QRService } from './services/qr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ScannerComponent, BlockComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firebase-cms';

  scannerEnabled = false;
  audioMode = false;
  blocked = false;

  constructor(
    private qrService: QRService,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private ninotsService: NinotsService,
  ){
    this.qrService.backEvent$.subscribe({
      next: () => {
        if(this.audioMode) {
          this.scannerEnabled = true;
          this.cd.detectChanges();
        } else{
          this.setOffScanner();
        }
      }
    })
  }

  ngOnInit() { 
    this.http.get<{ip:string}>('https://api.ipify.org?format=json')
    .subscribe(data => {
      const currentIp = data.ip;
      const storedIp = this.cookieService.get('ip');
      if (!storedIp || storedIp !== currentIp) {
        this.setNewIp(currentIp);
      } else {
        this.cookieService.set('refreshData', 'false');
        this.checkIpExists(currentIp);
      }
    });
  }

  async setNewIp(ip: string) {
    this.cookieService.set('ip', ip);
    this.cookieService.set('refreshData', 'true');
    // this.blocked = false;
    this.checkIpExists(ip);
  }

  async checkIpExists(ip: string) {
    this.ninotsService.getVisit(ip).then((visit: any) => { 
      // if (visit && visit['visitas'] < 10) {
      //   this.ninotsService.incrementVisitsIP(ip);
      // } else if(visit && visit['visitas'] >= 10) {
      //   // this.blocked = true;
      // } else {
      //   this.ninotsService.pushVisit(ip);
      // }
      if(visit){
        this.ninotsService.incrementVisitsIP(ip);
      } else {
        this.ninotsService.pushVisit(ip);
      }
    });
  }

  onScannerEnabled(event: any) {
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
    this.scannerEnabled = false;
    this.audioMode = false;
    this.cookieService.set('audioMode', 'false');
  }

}