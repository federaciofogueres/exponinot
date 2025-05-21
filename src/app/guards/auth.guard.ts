import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { CensoService } from "../services/censo.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  restricted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private censoService: CensoService,
  ) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      let token = this.authService.getToken();
      this.censoService.configuration.accessToken = token;
      return true;
    } else {
      if (this.restricted) {
        this.router.navigate(['/restricted']);
        return false;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

}
