import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconModule, CheckboxModule } from 'sn-common-lib';
import { FilterService } from '../../services/filter/filter.service';
import { TranslateModule } from '@ngx-translate/core';


fdescribe('SnFilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        IconModule,
        CheckboxModule,
        TranslateModule.forRoot()
      ],
      providers: [
        FilterService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).not.toBeUndefined();
  });


  it('on Open', () => {
    component.open();
    expect((component['el'].nativeElement as HTMLElement).style.display).not.toEqual('none');
  });


  it('on Close', () => {
    component.close();
    expect((component['el'].nativeElement as HTMLElement).style.display).toEqual('none');
  });


  it('on apply', () => {
    const spy = spyOn(component.filterApply, 'emit');
    component.apply();
    expect((component['el'].nativeElement as HTMLElement).style.display).toEqual('none');
    expect(spy).toHaveBeenCalled();
  });

});
