import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'main-menu',
        loadChildren: () => import('../main-menu/main-menu.module').then(m => m.MainMenuPageModule)
      },
      {
        path: 'game/:mode',
        loadChildren: () => import('../game/game.module').then(m => m.GamePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/main-menu',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/main-menu',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
