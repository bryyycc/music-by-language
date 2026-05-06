import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConnect } from './test-connect';

describe('TestConnect', () => {
  let component: TestConnect;
  let fixture: ComponentFixture<TestConnect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestConnect],
    }).compileComponents();

    fixture = TestBed.createComponent(TestConnect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
