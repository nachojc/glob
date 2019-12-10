import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentationComponent } from './components/documentation/documentation.component';


const routes: Routes = [
  { path: '', redirectTo: 'documentation', pathMatch: 'full'},
  {path: 'documentation', component: DocumentationComponent},
  {path: 'sample', loadChildren: () => import('./modules/branch-locator/branch-locator-wrapper.module').then(m => m.BranchLocatorModule)},
  { path: '**', redirectTo: 'documentation', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
