import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

let infiniteX = Infinity;
let infiniteY = Infinity;
let colorHue = 0;

@Injectable({
  providedIn: 'root'
})
export class PaintService {

  url = 'http://127.0.0.1:5000/guess';

  constructor(private http: HttpClient) { }

  private canvas: HTMLCanvasElement = null;
  private ctx: CanvasRenderingContext2D;

  public initialize(mountPoint: HTMLElement): any {
    this.canvas = mountPoint.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = mountPoint.offsetWidth;
    this.canvas.height = mountPoint.offsetHeight;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 30;
  }

  public paint({ clientX, clientY }) {
    this.ctx.strokeStyle = `hsl(${colorHue}, 100%, 60%)`;
    this.ctx.beginPath();
    if (Math.abs(infiniteX - clientX) < 100 && Math.abs(infiniteY - clientY) < 100) {
      this.ctx.moveTo(infiniteX, infiniteY);
    }
    this.ctx.lineTo(clientX, clientY);
    this.ctx.stroke();
    infiniteX = clientX;
    infiniteY = clientY;
    colorHue++;
  }

  public guessNumber(image: string): Observable<number> {
    return this.http.post<number>(this.url, image);
  }
}
