import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDocumentComponent } from './documents/add-document/add-document.component';
import { DocumentsComponent } from './documents/documents.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MonthPlanComponent } from './month-plans/month-plan/month-plan.component';
import { MonthPlansComponent } from './month-plans/month-plans/month-plans.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { NewsListComponent } from './news/news-list/news-list.component';
import { OmluvenkyComponent } from './omluvenky/omluvenky.component';
import { PhotogalleryComponent } from './photogallery/photogallery.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UsersListComponent } from './users/users-list/users-list.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomepageComponent},
  {path: 'omluvenky', component: OmluvenkyComponent},
  {path: 'mesicni-plany', component: MonthPlansComponent},
  {path: 'mesicni-plany/:id', component: MonthPlanComponent},
  {path: 'aktuality', component: NewsListComponent},
  {path: 'aktuality/pridat', component: NewsDetailComponent},
  {path: 'aktuality/upravit/:id', component: NewsDetailComponent},
  {path: 'uzivatele', component: UsersListComponent},
  {path: 'uzivatele/pridat', component: UserEditComponent},
  {path: 'uzivatele/upravit/:uid', component: UserEditComponent},
  {path: 'fotogalerie', component: PhotogalleryComponent},
  {path: 'dokumenty', component: DocumentsComponent},
  {path: 'dokumenty/:category', component: DocumentsComponent},
  {path: 'pridat-dokument', component: AddDocumentComponent},
  {path: 'pridat-dokument/:category', component: AddDocumentComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
