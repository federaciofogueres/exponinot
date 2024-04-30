import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CensoService } from '../../services/censo.service';
import { AlertService } from '../alert/alert.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = new FormControl('');
  password = new FormControl('');
  loading: boolean = false;
  
  constructor(
    private authService: AuthService,
    private route: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.route.navigateByUrl('home');
    }
  }

  async login() {
    this.loading = true;
    if(this.username.valid && this.password.valid) {
      console.log(`Username: ${this.username.value} - password: ${this.password.value}`);
      if (await this.authService.login(this.username.value!, this.password.value!)) {
        this.loading = false;
        this.alertService.success('Bienvenido!', 5000)
        this.route.navigateByUrl('home');
      } else {
        this.loading = false;
        this.alertService.danger('Datos incorrectos de inicio de sesión.', 5000)
      }
    }
  }
}
