import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';
@Injectable({
  providedIn: 'root'
})
export class EncoderService {

  private key = 'eFfFsJ2023*';
  private iv = CryptoJS.enc.Utf8.parse('1234567890123456');

  constructor() {
    this.key = 'eFfFsJ2023*';
    this.iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  }

  encryptPassword(data: string) {
    const saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds);
    let encodedPassword = bcrypt.hashSync(data, salt);
    return encodedPassword;
  }

  checkPassword(password: string, encrypted: string) {
    return bcrypt.compareSync(password, encrypted);
  }

  // Método para encriptar datos de entrada
  public encrypt(password: string): string {
    const encrypted = CryptoJS.AES.encrypt(password, this.key, { iv: this.iv });
    return encrypted.toString();
  }

  // Método para desencriptar datos de entrada
  public decrypt(passwordToDecrypt: string): string {
    const decrypted = CryptoJS.AES.decrypt(passwordToDecrypt, this.key, { iv: this.iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
