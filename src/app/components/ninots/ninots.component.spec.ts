import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinotsComponent } from './ninots.component';

describe('NinotsComponent', () => {
  let component: NinotsComponent;
  let fixture: ComponentFixture<NinotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NinotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
