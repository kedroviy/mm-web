import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { HeaderConfig, HeaderUser } from '@shared/kit/kit-header/kit-header.type';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UiButtonComponent } from '@shared/kit/button/button';
import { COMMON_CONSTANTS } from '@core/constants';
import { AuthFacade } from '@core/services/auth/auth.facade';

@Component({
  selector: 'app-kit-header',
  imports: [MatToolbarModule, MatIconModule, UiButtonComponent],
  templateUrl: './kit-header.html',
  styleUrl: './kit-header.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitHeader {
  private authFacade = inject(AuthFacade);
  title = input<string>();
  user = input<HeaderUser | null>(null);
  config = input<HeaderConfig>({});
  profile = this.authFacade.profile;
  userInitials = computed(() => {
  console.log('profile: ', this.profile())
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
    const name = this.user()?.name || 'Guest';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 65%, 45%)`;
  });

  profileClick = output<void>();
}
