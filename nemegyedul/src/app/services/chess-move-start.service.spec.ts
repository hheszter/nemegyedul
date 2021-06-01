import { TestBed } from '@angular/core/testing';

import { ChessMoveStartService } from './chess-move-start.service';

describe('ChessMoveStartService', () => {
  let service: ChessMoveStartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessMoveStartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
