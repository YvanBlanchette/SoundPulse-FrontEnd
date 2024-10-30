import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryItemComponent } from './library-item.component';

describe('LibraryItemComponent', () => {
  let component: LibraryItemComponent;
  let fixture: ComponentFixture<LibraryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
