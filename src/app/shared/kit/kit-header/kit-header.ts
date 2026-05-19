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
import { KitAvatar } from '@shared/kit/kit-avatar/kit-avatar';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-kit-header',
  imports: [MatToolbarModule, KitAvatar],
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
  avatarHue = this.authService.avatarHue;

  profileAriaLabel = computed(() => {
    const name = this.profile()?.username?.trim();
    return name ? `Профиль: ${name}` : 'Профиль';
  });

  profileClick = output<void>();
}
