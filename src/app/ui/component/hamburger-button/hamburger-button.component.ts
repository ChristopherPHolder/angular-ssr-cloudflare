import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Attribute selector on a real <button>: below the index breakpoint this is
 * the only route to Discover and Genres, so it has to be a focusable,
 * Enter/Space-operable control with a legitimate home for aria-expanded.
 * A custom element wrapping three spans was none of those things.
 */
@Component({
  selector: 'button[uiHamburgerButton]',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    class: 'hamburger-button',
    type: 'button',
  },
})
export class HamburgerButtonComponent {}
