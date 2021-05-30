import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChessTestService {

  chessBoardStateChanged = new Subject<any>();
  chessPieceNotMoved = new Subject<any>();

  constructor() { }
}
