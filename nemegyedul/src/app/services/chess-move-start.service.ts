import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessMoveStartService {

  chessPiecePicked = new Subject<any>();

  constructor() { }
}
