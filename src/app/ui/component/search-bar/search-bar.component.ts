import { Component, input, linkedSignal, output, ViewEncapsulation } from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

/**
 * The field never collapses, so the component no longer needs the open/closed
 * state machine the old one carried: no document click listener, no view
 * refs, no RxJS. On narrow screens CSS gives the strip a second row instead.
 */
@Component({
  imports: [FastSvgComponent],
  selector: 'ui-search-bar',
  template: `
    <form data-uf="q-form" class="form" (submit)="submit($event)">
      <button type="submit" class="magnifier-button" aria-label="Search for a movie">
        <fast-svg name="search" size="14" />
      </button>
      <input
        #searchInput
        data-uf="q"
        type="search"
        aria-label="Search the archive"
        placeholder="Search the archive"
        class="input"
        [value]="search()"
        (input)="search.set(searchInput.value)"
      />
    </form>
  `,
  styleUrls: ['search-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SearchBarComponent {
  readonly query = input('');

  /** Seeded from the routed query, then owned by whatever the visitor types. */
  protected readonly search = linkedSignal(() => this.query());

  readonly searchSubmit = output<string>();

  protected submit(event: Event): void {
    event.preventDefault();
    this.searchSubmit.emit(this.search());
  }
}
