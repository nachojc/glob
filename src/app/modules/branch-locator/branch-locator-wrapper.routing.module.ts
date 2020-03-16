import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchLocatorWrapperComponent } from './branch-locator-wrapper.component';




const routes: Routes = [
  {
    path: '', component: BranchLocatorWrapperComponent,
    data: {
      header: {
        display: true
      },
      footer: {
          display: false
      },
      showChatbot: false
    }
  },
  { path: '**', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchLocatorRoutingModule {}
