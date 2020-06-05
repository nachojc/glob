import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import {
  ButtonModule,
  IconModule,
  LoaderModule,
  LoadingModule,
  OptionListModule
} from 'sn-common-lib';
import { SnMapDirective } from './directives/sn-map/sn-map.directive';
import { SnMarkerDirective } from './directives/sn-marker/sn-marker.directive';
import { SnBranchLocatorComponent } from './components/branch-locator/sn-branch-locator.component';
import { BranchSearchInputModule } from './components/branch-search/branch-search.module';
import { SnBranchInfoComponent } from './components/sn-branch-info/sn-branch-info.component';
import { FilterModule } from './components/filter/filter.module';
import { DrawerModule } from './components/sn-drawer';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { SnTabModule } from './components/tabs/sn-tab.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SnDirectionModule } from './directives/sn-direction/sn-direction.module';
import { SnBranchDirectionComponent } from './components/sn-branch-direction/sn-branch-direction.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { SnBranchLocatorService } from './services/branch-locator/branch-locator.service';
import { LabelPipe } from './pipes/label/label.pipe';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [
    SnBranchLocatorComponent,
    SnMapDirective,
    SnBranchInfoComponent,
    SnMarkerDirective,
    MenuComponent,
    BranchListComponent,
    SnBranchDirectionComponent,
    SafePipe
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    AgmCoreModule,
    AgmJsMarkerClustererModule,
    OptionListModule,
    IconModule,
    ButtonModule,
    SnTabModule,
    BranchSearchInputModule,
    OptionListModule,
    DrawerModule,
    FilterModule,
    LoadingModule,
    LoaderModule,
    SnDirectionModule
  ],
  providers: [SnBranchLocatorService, LabelPipe],
  exports: [SnBranchLocatorComponent]
})
export class SnBranchLocatorModule {}
