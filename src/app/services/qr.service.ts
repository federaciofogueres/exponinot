import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';
import { QRModel } from '../models/qr-model';

@Injectable({
  providedIn: 'root'
})
export class QRService {

  constructor() { }

  async generateQRCode(data: QRModel): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Data: ', data);
        const url = await QRCode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: 'H', scale: 10 });
        resolve(url);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
}