import { NgModule, ModuleWithProviders } from '@angular/core';
import { SnDirectionDirective } from '../../directives/sn-direction/sn-direction.directive';

export * from '../../directives/sn-direction/sn-direction.directive';

@NgModule({
  imports: [],
  declarations: [
    SnDirectionDirective,
  ],
  exports: [
    SnDirectionDirective,
  ]
})
export class SnDirectionModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SnDirectionModule,
    };
  }
}
