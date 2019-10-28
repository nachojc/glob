import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { IconModule } from 'sn-common-lib';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [IconModule,
        BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open menu', () => {
    component.open();
    fixture.detectChanges();
    expect(component.currentState).toBe('menuOpened');
  });

  it('should change state to closed', () => {
    component.currentState = 'menuOpened';
    component.changeState();
    fixture.detectChanges();
    expect(component.currentState).toBe('menuClosed');
  });

  it('should change state to opened', () => {
    component.currentState = 'menuClosed';
    component.changeState();
    fixture.detectChanges();
    expect(component.currentState).toBe('menuOpened');
  });
});
