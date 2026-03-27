import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { HeaderConfig, HeaderUser } from '@shared/kit/kit-header/kit-header.type';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UiButtonComponent } from '@shared/kit/button/button';
import { COMMON_CONSTANTS } from '@core/constants';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-kit-header',
  imports: [MatToolbarModule, MatIconModule, UiButtonComponent],
  templateUrl: './kit-header.html',
  styleUrl: './kit-header.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitHeader {
  private authService = inject(AuthService);

  user = input<HeaderUser | null>(null);
  config = input<HeaderConfig>({});
  logoUrl = input<string>('assets/logo.svg');
  appName = input<string>('MovieMatch admin panel');

  profile = this.authService.profile;

  userInitials = computed(() => {
    const name = this.profile()?.name;
    if (!name) return COMMON_CONSTANTS.EMPTY_STRING;
    return name
      .split(' ')
      .map((part) => part[0])
      .join(COMMON_CONSTANTS.EMPTY_STRING)
      .toUpperCase()
      .substring(0, 2);
  });

  userColor = computed(() => {
    const name = this.profile()?.name || 'Guest';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Используем HSL для более приятных пастельных тонов
    return `hsl(${hash % 360}, 65%, 45%)`;
  });

  profileClick = output<void>();
}
