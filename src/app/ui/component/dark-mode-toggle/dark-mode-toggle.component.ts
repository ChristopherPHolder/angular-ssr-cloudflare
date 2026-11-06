import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';

type Scheme = 'light' | 'dark';

/**
 * The colour scheme follows the operating system until the visitor overrides
 * it, and the override is a single `color-scheme` on the root element — every
 * token is declared once with `light-dark()` and resolves from there.
 *
 * Nothing here reads a media query. Which option looks active is decided in
 * CSS, so the control is correct in auto mode without any state to track.
 */
@Component({
  selector: 'ui-dark-mode-toggle',
  template: `
    <div class="switch" role="group" aria-label="Colour scheme">
      <button
        type="button"
        class="opt opt--light"
        aria-label="Use the light theme"
        [attr.aria-pressed]="chosen() === 'light'"
        (click)="choose('light')"
      >
        Light
      </button>
      <span class="sep" aria-hidden="true">/</span>
      <button
        type="button"
        class="opt opt--dark"
        aria-label="Use the dark theme"
        [attr.aria-pressed]="chosen() === 'dark'"
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

  /** Null until the visitor overrides the system preference. */
  readonly chosen = signal<Scheme | null>(null);

  choose(scheme: Scheme): void {
    this.chosen.set(scheme);
    this.document.documentElement.dataset['theme'] = scheme;
  }
}
