import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinotComponent } from './ninot.component';

describe('NinotComponent', () => {
  let component: NinotComponent;
  let fixture: ComponentFixture<NinotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NinotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
