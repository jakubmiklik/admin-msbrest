import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MonthPlanComponent } from './month-plans/month-plan/month-plan.component';
import { MonthPlansComponent } from './month-plans/month-plans/month-plans.component';
import { OmluvenkyComponent } from './omluvenky/omluvenky.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomepageComponent},
  {path: 'omluvenky', component: OmluvenkyComponent},
  {path: 'mesicni-plany', component: MonthPlansComponent},
  {path: 'mesicni-plany/:id', component: MonthPlanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
