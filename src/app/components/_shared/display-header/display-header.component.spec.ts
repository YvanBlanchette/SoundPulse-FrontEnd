import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayHeaderComponent } from './display-header.component';

describe('DisplayHeaderComponent', () => {
  let component: DisplayHeaderComponent;
  let fixture: ComponentFixture<DisplayHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
