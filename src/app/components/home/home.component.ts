import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

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

  handleQrCodeResult(resultString: string) {
    console.log('Resultado del escaneo QR: ', resultString);
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
  }

}
