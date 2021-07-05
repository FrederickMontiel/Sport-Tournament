import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeagueComponent } from './new-league.component';

describe('NewLeagueComponent', () => {
  let component: NewLeagueComponent;
  let fixture: ComponentFixture<NewLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLeagueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
