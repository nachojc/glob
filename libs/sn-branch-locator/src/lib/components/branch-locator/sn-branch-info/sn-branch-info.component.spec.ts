import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnBranchInfoComponent } from './sn-branch-info.component';
import { SnTabModule } from '../../tabs/sn-tab.module';
import { OptionListModule, IconModule } from 'sn-common-lib';

describe('SnBranchInfoComponent', () => {
  let component: SnBranchInfoComponent;
  let fixture: ComponentFixture<SnBranchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnBranchInfoComponent ],
      imports: [
        SnTabModule,
        IconModule,
        OptionListModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
