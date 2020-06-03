import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuComponent} from './menu.component';
import {IconModule} from 'sn-common-lib';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FilterComponent} from '../filter/filter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let fixtureFilter: ComponentFixture<FilterComponent>;
  const fakeFilter = {
    isOpen: () => false
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent, MenuComponent],
      imports: [IconModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    fixtureFilter = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.filter = fixtureFilter.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open menu', () => {
    component.open();
    expect(component.currentState).toBe('menuOpened');
  });

  it('should change state to closed', () => {
    component.currentState = 'menuOpened';
    component.changeState();
    expect(component.currentState).toBe('menuClosed');
  });

  it('should change state to opened', () => {
    component.currentState = 'menuClosed';
    component.changeState();
    expect(component.currentState).toBe('menuOpened');
  });
});
