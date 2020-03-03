import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnBranchDirectionComponent } from './sn-branch-direction.component';
import { SafePipe } from '../../pipes/safe.pipe';
import { IconModule } from 'sn-common-lib';
import { TranslateModule } from '@ngx-translate/core';
import { branchMock } from '../../helpers/branch.mock';
import { routesMock } from '../../helpers/routes.mock';

describe('SnBranchDirectionComponent', () => {
  let component: SnBranchDirectionComponent;
  let fixture: ComponentFixture<SnBranchDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IconModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        SnBranchDirectionComponent,
        SafePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the branch', () => {
    (component as any)._branch = branchMock;
    expect(component.branch).toBe((component as any)._branch);
  });

  it('should set the branch', async(() => {
    component.branch = branchMock;
    expect((component as any)._branch).toBe(branchMock);
  }));

  it('should get the routes', () => {
    (component as any)._routes = routesMock;
    expect(component.routes).toBe((component as any)._routes);
  });

  it('should set the routes', async(() => {
    component.routes = routesMock;
    expect((component as any)._routes).toBe(routesMock);
  }));

  it('should emit geoCoords when click on route type', () => {
    const geoCoords = {
      geoCoords: {
        latitude: 40.3588381,
        longitude: -3.83045
      },
      travelMode: 'BICYCLING'
    };
    const spy = spyOn(component.branchDirection, 'emit');
    component.emitDirectionCoords(geoCoords);
    expect(spy).toHaveBeenCalledWith(geoCoords);
  });

});
