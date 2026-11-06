import { Component, computed, input, ViewEncapsulation } from '@angular/core';

/**
 * Magnitude is measured, never iconic: the bar's length IS the value, with
 * the figure beside it. This replaces the five-star widget, which drew ten
 * glyph spans and a tooltip to say less.
 */
@Component({
  selector: 'ui-rating',
  template: `
    <span class="track" aria-hidden="true">
      <span class="fill" [style.width.%]="percent()"></span>
    </span>
    <span class="figure">{{ display() }}</span>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--s-2);
      min-width: 0;
    }

    .track {
      flex: 1 1 auto;
      min-width: 20px;
      height: 2px;
      background: var(--rule);
    }

    .fill {
      display: block;
      height: 2px;
      background: var(--ink-dim);
    }

    .figure {
      flex: 0 0 auto;
      font-family: var(--font-code);
      font-variant-numeric: tabular-nums;
      font-size: var(--t-code);
      letter-spacing: 0.06em;
      color: var(--ink-dim);
    }
  `,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'img',
    '[attr.aria-label]': 'label()',
  },
})
export class RatingComponent {
  /** TMDB vote average, 0–10. */
  readonly rating = input.required<number>();

  protected readonly value = computed(() => {
    const raw = this.rating();
    return Number.isFinite(raw) ? Math.min(10, Math.max(0, raw)) : 0;
  });

  protected readonly percent = computed(() => this.value() * 10);
  protected readonly display = computed(() => this.value().toFixed(1));
  protected readonly label = computed(
    () => `Rated ${this.display()} out of 10`,
  );
}
