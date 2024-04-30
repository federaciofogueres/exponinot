import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';
import { AlertType } from './alertType.enum';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  public message!: string | null;
  public type!: AlertType;
  public subscription!: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.message = alert.message;
      this.type = alert.type;
      setTimeout(() => this.closeAlert(), alert.duration);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeAlert() {
    this.message = null;
  }
}
