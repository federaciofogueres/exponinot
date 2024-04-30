import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    protected router: Router,
    protected authService: AuthService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

}
