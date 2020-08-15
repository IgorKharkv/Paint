import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {PaintService} from './paint.service';
import {fromEvent} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit, AfterViewInit {

  canvas: HTMLCanvasElement;

  constructor(private paintSvc: PaintService, private elRef: ElementRef) { }

  ngOnInit(): void {
    console.log(this.elRef);
    this.paintSvc.initialize(this.elRef.nativeElement);
    this.startPainting();
  }

  private putImage(): void{
    console.log(this.canvas.toDataURL());
  }

  private startPainting(): any{
    const { nativeElement } = this.elRef;
    this.canvas = nativeElement.querySelector('canvas') as HTMLCanvasElement;
    const move$ = fromEvent<MouseEvent>(this.canvas, 'mousemove');
    const down$ = fromEvent<MouseEvent>(this.canvas, 'mousedown');
    const up$ = fromEvent<MouseEvent>(this.canvas, 'mouseup');
    const paints$ = down$.pipe(
      mergeMap(down => move$.pipe(takeUntil(up$)))
      // mergeMap(down => move$)
    );

    down$.subscribe(console.log);

    const offset = getOffset(this.canvas);

    paints$.subscribe((event) => {
      const clientX = event.clientX - offset.left;
      const clientY = event.clientY - offset.top;
      this.paintSvc.paint({ clientX, clientY });
    });
  }

  ngAfterViewInit(): void {
  }
}

function getOffset(el: HTMLElement): any {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
}
