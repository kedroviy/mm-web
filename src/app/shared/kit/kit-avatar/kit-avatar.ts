import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { KitAvatarSize } from './kit-avatar.types';
import { hueFromString, initialsFromDisplayName, normalizeHueDegrees } from './kit-avatar.utils';

@Component({
  selector: 'app-kit-avatar',
  imports: [],
  templateUrl: './kit-avatar.html',
  styleUrl: './kit-avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--kit-avatar-h]': 'hueCss()',
  },
  standalone: true,
})
export class KitAvatar {
  /** Имя для инициалов; fallback-оттенок, если accentHue не задан. */
  displayName = input<string | null | undefined>(undefined);
  /** Явный оттенок HSL (0–359), например из AuthService после логина. */
  accentHue = input<number | null | undefined>(undefined);
  /** Подпись для кнопки (aria-label), обязательна для доступности. */
  label = input.required<string>();
  /** URL изображения; при отсутствии показываются инициалы. */
  imageUrl = input<string | null | undefined>(undefined);
  size = input<KitAvatarSize>('md');
  disabled = input(false);

  activated = output<void>();

  protected readonly initials = computed(() => initialsFromDisplayName(this.displayName()));

  protected readonly hueCss = computed(() => {
    const accent = this.accentHue();
    if (accent != null && Number.isFinite(accent)) {
      return String(normalizeHueDegrees(accent));
    }
    const seed = this.displayName()?.trim() || 'Guest';
    return String(hueFromString(seed));
  });

  protected onActivate(): void {
    if (this.disabled()) {
      return;
    }
    this.activated.emit();
  }
}
