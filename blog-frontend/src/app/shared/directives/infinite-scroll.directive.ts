import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  inject,
  OnInit,
  OnDestroy,
  output
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  scrolled = output<void>();

  private elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        // Emit the event if the element is intersecting (visible)
        if (entry.isIntersecting) {
          this.scrolled.emit();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    // Disconnect the observer when the directive is destroyed
    this.observer?.disconnect();
  }
}
