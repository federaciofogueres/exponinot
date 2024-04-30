import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertType } from './alertType.enum';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert$ = new Subject<{type: AlertType, message: string, duration: number}>();

  success(message: string, duration: number = 5000) {
    this.alert$.next({ type: AlertType.Success, message: message, duration: duration });
  }

  danger(message: string, duration: number = 5000) {
    this.alert$.next({ type: AlertType.Danger, message: message, duration: duration });
  }

  warning(message: string, duration: number = 5000) {
    this.alert$.next({ type: AlertType.Warning, message: message, duration: duration });
  }

  info(message: string, duration: number = 5000) {
    this.alert$.next({ type: AlertType.Info, message: message, duration: duration });
  }
}
