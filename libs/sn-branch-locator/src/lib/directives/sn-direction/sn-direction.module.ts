import { NgModule, ModuleWithProviders } from '@angular/core';
import { SnDirectionDirective } from './sn-direction.directive';

export * from './sn-direction.directive';

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
