import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {

  chessPieces = {
    BlackBishop: '../../../../assets/images/chess/BlackBishop.png',
    BlackKing: '../../../../assets/images/chess/BlackKing.png',
    BlackKnight: '../../../../assets/images/chess/BlackKnight.png',
    BlackPawn: '../../../../assets/images/chess/BlackPawn.png',
    BlackQueen: '../../../../assets/images/chess/BlackQueen.png',
    BlackRook: '../../../../assets/images/chess/BlackRook.png',
    WhiteBishop: '../../../../assets/images/chess/WhiteBishop.png',
    WhiteKing: '../../../../assets/images/chess/WhiteKing.png',
    WhiteKnight: '../../../../assets/images/chess/WhiteKnight.png',
    WhitePawn: '../../../../assets/images/chess/WhitePawn.png',
    WhiteQueen: '../../../../assets/images/chess/WhiteQueen.png',
    WhiteRook: '../../../../assets/images/chess/BlackRook.png'
  }

  board: Array<Array<string>> = [
    ['BlackRook', 'BlackKnight', 'BlackBishop', 'BlackQueen', 'BlackKing', 'BlackBishop', 'BlackKnight', 'BlackRook'],
    ['BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhiteKing', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn'],
    ['WhiteRook', 'WhiteKnight', 'WhiteBishop', 'WhiteQueen', 'WhiteBishop', 'WhiteKnight', 'WhiteRook']
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
