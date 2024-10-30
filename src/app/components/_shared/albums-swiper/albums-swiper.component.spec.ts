import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsSwiperComponent } from './albums-swiper.component';

describe('AlbumsSwiperComponent', () => {
  let component: AlbumsSwiperComponent;
  let fixture: ComponentFixture<AlbumsSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumsSwiperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumsSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
