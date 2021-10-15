import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcomparisonComponent } from './productcomparison.component';

describe('ProductcomparisonComponent', () => {
  let component: ProductcomparisonComponent;
  let fixture: ComponentFixture<ProductcomparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductcomparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductcomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
