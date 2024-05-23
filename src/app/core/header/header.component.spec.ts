import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWidget } from './header.widget';

describe('HeaderComponent', () => {
  let component: HeaderWidget;
  let fixture: ComponentFixture<HeaderWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
