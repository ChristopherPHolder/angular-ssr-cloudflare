import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';

type Scheme = 'light' | 'dark';

const STORAGE_KEY = 'colour-scheme';

/**
 * The scheme follows the operating system until the visitor overrides it, and
 * the override is a single `color-scheme` on the root element — every token is
 * declared once with `light-dark()` and resolves from there.
 *
 * Which option *looks* active is still decided in CSS. The resolved scheme is
 * additionally mirrored into `aria-pressed` so the state is programmatically
 * determinable and not communicated by colour alone; reading
 * `prefers-color-scheme` is a scheme query, not a viewport query, and nothing
 * here measures the viewport.
 */
@Component({
  selector: 'ui-dark-mode-toggle',
  template: `
    <div class="switch" role="group" aria-label="Colour scheme">
      <button
        type="button"
        class="opt opt--light"
        aria-label="Use the light theme"
        [attr.aria-pressed]="resolved() === 'light'"
        (click)="choose('light')"
      >
        Light
      </button>
      <span class="sep" aria-hidden="true">/</span>
      <button
        type="button"
        class="opt opt--dark"
        aria-label="Use the dark theme"
        [attr.aria-pressed]="resolved() === 'dark'"
        (click)="choose('dark')"
      >
        Dark
      </button>
    </div>
  `,
  styleUrls: ['dark-mode-toggle.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DarkModeToggleComponent {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** The scheme actually in force, whether chosen here or by the system. */
  readonly resolved = signal<Scheme | null>(null);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const stored = this.read();
    if (stored) {
      this.apply(stored);
      return;
    }

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    this.resolved.set(query.matches ? 'dark' : 'light');
    query.addEventListener('change', (event) => {
      if (!this.read()) {
        this.resolved.set(event.matches ? 'dark' : 'light');
      }
    });
  }

  choose(scheme: Scheme): void {
    this.apply(scheme);
    try {
      localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // Private mode or blocked storage: the choice still holds this session.
    }
  }

  private apply(scheme: Scheme): void {
    this.resolved.set(scheme);
    this.document.documentElement.dataset['theme'] = scheme;
  }

  private read(): Scheme | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }
}
