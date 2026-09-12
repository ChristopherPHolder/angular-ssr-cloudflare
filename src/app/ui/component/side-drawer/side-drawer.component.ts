import {
  Component,
  Output,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { rxActions } from '@rx-angular/state/actions';

import { BackdropComponent } from '../backdrop/backdrop.component';

@Component({
  imports: [BackdropComponent],
  selector: 'ui-side-drawer',
  template: `
    <ui-backdrop (click)="ui.openedChange(false)" [opened]="opened()"></ui-backdrop>
    <div class="side-drawer" [class.opened]="opened()">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./side-drawer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SideDrawerComponent {
  readonly ui = rxActions<{ openedChange: boolean }>();
  readonly opened = input(false);
  @Output() openedChange = this.ui.openedChange$;
}
