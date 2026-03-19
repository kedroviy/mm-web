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
  // protected readonly title = signal('Movie Match Admin Dashboard');

  ngOnInit() {
    fetch(`${environment.apiBaseUrl}/api/v1/health`)
      .then((res) => res.json())
      .catch(err => console.error('Ошибка:', err));
  }
}
