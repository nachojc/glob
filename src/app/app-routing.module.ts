import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { SampleComponent } from './components/sample/sample.component';

const routes: Routes = [
  { path: '', redirectTo: 'documentation', pathMatch: 'full'},
  {path: 'documentation', component: DocumentationComponent},
  {path: 'sample', component: SampleComponent},
  { path: '**', redirectTo: 'documentation', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
