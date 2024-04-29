import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ZXingScannerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scannerEnabled = false;

  constructor(private router: Router) { }

  handleQrCodeResult(resultString: string) {
    console.log('Resultado del escaneo QR: ', resultString);
    this.router.navigate(['/ninots', resultString]);
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
  }

}
