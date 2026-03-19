import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnInit {
  protected readonly title = signal('Admin Dashboard');

  ngOnInit() {
    fetch(`${environment.apiBaseUrl}/api/v1/health`)
      .then((res) => res.json())
      .then((data) => console.log('Данные от NestJS:', data))
      .catch(err => console.error('Ошибка:', err));
  }
}
