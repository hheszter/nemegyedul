import { TestBed } from '@angular/core/testing';

import { ChessTestService } from './chess-test.service';

describe('ChessTestService', () => {
  let service: ChessTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
