import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCommunityComponent } from './my-community.component';

describe('MyCommunityComponent', () => {
  let component: MyCommunityComponent;
  let fixture: ComponentFixture<MyCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCommunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
