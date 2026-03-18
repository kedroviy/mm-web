import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit(data: { login: string; password: string }) {
    this.auth.login(data).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
