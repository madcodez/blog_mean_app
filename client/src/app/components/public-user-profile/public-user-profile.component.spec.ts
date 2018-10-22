import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUserProfileComponent } from './public-user-profile.component';

describe('PublicUserProfileComponent', () => {
  let component: PublicUserProfileComponent;
  let fixture: ComponentFixture<PublicUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicUserProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
