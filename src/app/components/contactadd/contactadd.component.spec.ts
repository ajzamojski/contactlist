import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactaddComponent } from './contactadd.component';

describe('ContactaddComponent', () => {
  let component: ContactaddComponent;
  let fixture: ComponentFixture<ContactaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
