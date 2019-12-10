import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SnBranchLocatorComponent } from '@globile/branch-locator';




const routes: Routes = [
  {
    path: '', component: SnBranchLocatorComponent,
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
