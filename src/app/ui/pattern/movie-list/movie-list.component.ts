import { NgOptimizedImage } from '@angular/common';
import { RxState } from '@rx-angular/state';
import { Component, inject, Input, output, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { coerceObservable } from '../../../shared/cdk/coerceObservable';
import { RxInputType } from '../../../shared/cdk/input-type.typing';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
import { ElementVisibilityDirective } from '../../../shared/cdk/element-visibility/element-visibility.directive';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { GridListComponent } from '../../component/grid-list/grid-list.component';
import { Movie } from '../../../state/movie.state';

@Component({
  imports: [
    RouterLink,
    RatingComponent,
    ElementVisibilityDirective,
    FastSvgComponent,
    GridListComponent,
    NgOptimizedImage,
  ],
  selector: 'ui-movie-list',
  template: `
    @if (moviesListVisible()) {
      <!--
        The grease-pencil stroke is declared once and referenced per frame,
        so a hundred frames cost one path's worth of markup, not a hundred.
      -->
      <svg width="0" height="0" aria-hidden="true" style="position:absolute">
        <symbol id="chinagraph" viewBox="0 0 200 300">
          <path
            d="M101 13c57 1 91 59 89 136-2 74-32 138-91 138-57 0-88-62-88-139C11 73 44 15 98 13c23-1 44 5 57 17"
          />
        </symbol>
      </svg>

      <ui-grid-list>
        <!--
            **🚀 Perf Tip for TBT:**
            Use \`@for\` to keep rendering non-blocking instead of relying on \`ngFor\` or \`rxFor\`.
            Angular's new render loops work with signals as long as the input stays pure.
        -->
        @for (movie of movieItems(); track movie.id; let idx = $index) {
          <a
            class="frame ui-grid-list-item"
            [routerLink]="['/detail/movie', movie.id]"
            [attr.data-uf]="'movie-' + idx"
          >
            <span class="frame--plate">
              <!--
                **🚀 Perf Tip for LCP:**
                Prefer the native HTML attribute loading="lazy" instead of an extra directive.
                This cuts bootstrap and template evaluation cost.
              -->
              <img
                class="frame--poster"
                [ngSrc]="movie.imgSrc"
                [ngSrcset]="movie.imgSrcset"
                [sizes]="movie.imgSizes"
                [priority]="idx < numPriority()"
                [width]="movie.imgWidth"
                [height]="movie.imgHeight"
                alt=""
                [title]="movie.title"
              />
              <svg class="frame--mark" viewBox="0 0 200 300" aria-hidden="true">
                <use class="mark-halo" href="#chinagraph" />
                <use href="#chinagraph" />
              </svg>
            </span>

            <span class="frame--gutter">
              <span class="frame--code code">
                <span>TMDB {{ movie.id }}</span>
                <span>{{ movie.release_date?.slice(0, 4) || '—' }}</span>
              </span>
              <h3 class="frame--title">{{ movie.title }}</h3>
              <ui-rating [rating]="movie.vote_average" />
            </span>
          </a>
        }
        <!-- If this element is visible in the viewport the paginate event fires -->
        <div (elementVisibility)="onVisible($event)"></div>
      </ui-grid-list>
    } @else {
      <p class="empty">
        <fast-svg class="empty--icon" name="sad" size="20" />
        <span>Nothing in the archive matches that.</span>
      </p>
    }
  `,
  styleUrls: ['./movie-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MovieListComponent {
  private readonly state =
    inject<RxState<{ movies?: Movie[]; numPriority: number }>>(RxState);

  numPriority() {
    return this.state.get('numPriority');
  }

  @Input()
  set withImgPriority(p: number) {
    if (p) {
      this.state.set({ numPriority: p });
    } else {
      this.state.set({ numPriority: 0 });
    }
  }

  readonly movies$ = this.state.select('movies') as Observable<Movie[]>;
  readonly movieItems = toSignal(this.movies$, { initialValue: [] as Movie[] });

  // if no movies are given we don't need to render nor listen for the infinite scroll trigger
  readonly moviesListVisible = toSignal(
    this.state.select(map((state) => !!state.movies && state.movies.length > 0)),
    { initialValue: false },
  );

  @Input({ required: true })
  set movies(movies$: RxInputType<Movie[]>) {
    this.state.connect('movies', coerceObservable(movies$));
  }

  readonly paginate = output<void>();

  constructor() {
    this.state.set({ numPriority: 2 });
  }

  // emit paginate event only if the trigger element became visible
  protected onVisible(visible: boolean) {
    if (visible) {
      this.paginate.emit();
    }
  }
}
