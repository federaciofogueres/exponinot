import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';
import { Subject } from 'rxjs';
import { QRModel } from '../models/qr-model';

@Injectable({
  providedIn: 'root'
})
export class QRService {
  private backEvent = new Subject<void>();

  backEvent$ = this.backEvent.asObservable();

  constructor() { }

  back() {
    this.backEvent.next();
  }

  async generateQRCode(data: QRModel | string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof data !== 'string') {
          data = JSON.stringify(data)
        }
        const url = await QRCode.toDataURL(data, { errorCorrectionLevel: 'H', scale: 10 });
        resolve(url);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
}