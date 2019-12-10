import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTabComponent } from './sn-tab.component';

describe('SnTabComponent', () => {
  let component: SnTabComponent;
  let fixture: ComponentFixture<SnTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have label', () => {
    expect(component.label).toEqual('');
  });

  it('should have label', () => {
    component.label = 'Label';
    expect(component.label).not.toEqual('');
  });

  it('should get index to be called', () => {
    expect(component.index).toEqual(component['_index']);
  });

  it('should set index to be called', () => {
    component.index = 1;
    component['_id'] = `sn-tab-${component['_index']}`;
    expect(component.index).toEqual(component['_index']);
  });

  it('should get id contain a string part', () => {
    component.index = 1;
    component['_id'] = `sn-tab-${component['_index']}`;
    expect(component.id).toContain('sn-tab-');
  });


  it('should get isTabActive return undefined', () => {
    expect(component.isTabActive).toBeFalsy();
  });

  it('should get isTabActive return false', () => {
    component['_active'] = false;
    expect(component.isTabActive).toBeFalsy();
    expect(component.isTabActive).toEqual(false);
  });

  it('should get isTabActive return true', () => {
    component['_active'] = true;
    expect(component.isTabActive).toBeTruthy();
    expect(component.isTabActive).toEqual(true);
  });

  it('should setTabActive to be called', () => {
    spyOn(component, 'setTabActive').and.callThrough();
    component.setTabActive();
    expect(component.setTabActive).toHaveBeenCalled();
  });

  it('should setTabInactive to be called', () => {
    spyOn(component, 'setTabInactive').and.callThrough();
    component.setTabInactive();
    expect(component.setTabInactive).toHaveBeenCalled();
  });
  it('when change the label should send the new value ', done => {
    component.index = 1;
    component.onLabelChange().subscribe(val => {
      expect(val).toEqual({index: 1, label: 'Hi'});
      done();
    });
    component.label = 'Hi';
    fixture.detectChanges();
  });
  it('when change the label for null change the value to empty', async(() => {
    component.index = 1;
    component.label = 'Hi';
    component.label = null;
    expect(component.label).toEqual('');
  }));

});
