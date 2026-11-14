import {
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ui-detail-grid',
  template: `
    <div class="grid--item grid--plate">
      <ng-content select="[detailGridMedia]"></ng-content>
    </div>
    <div class="grid--item grid--description">
      <ng-content select="[detailGridDescription]"></ng-content>
    </div>
  `,
  styleUrls: ['./detail-grid.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DetailGridComponent {}
