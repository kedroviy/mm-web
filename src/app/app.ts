import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { RootLayout } from './widgets/root-layout/root-layout';

@Component({
  selector: 'app-root',
  imports: [RootLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnInit {
  ngOnInit() {
    fetch(`${environment.apiBaseUrl}/api/v1/health`)
      .then((res) => res.json())
      .catch((err) => console.error('Ошибка:', err));
  }
}
