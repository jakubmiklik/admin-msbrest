import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { WidgetComponent } from './widget/widget.component';
import { HomepageComponent } from './homepage/homepage.component';
import { OmluvenkyComponent } from './omluvenky/omluvenky.component';
import { MonthPlansComponent } from './month-plans/month-plans/month-plans.component';
import { MonthPlanComponent } from './month-plans/month-plan/month-plan.component';
import { NewsListComponent } from './news/news-list/news-list.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { Dialog, UsersListComponent } from './users/users-list/users-list.component';
import { UploadComponent } from './upload/upload.component';
import { AddPhotoComponent } from './photogallery/add-photo/add-photo.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { PhotogalleryComponent } from './photogallery/photogallery.component';
import { DocumentsComponent } from './documents/documents.component';
import { AddDocumentComponent } from './documents/add-document/add-document.component';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { FireStorageService } from './firestorage.service';

import { MonthPipe } from './month.pipe';
import { DayPipe } from './day.pipe';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    CKEditorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    A11yModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    WidgetComponent,
    HomepageComponent,
    MonthPipe,
    DayPipe,
    OmluvenkyComponent,
    MonthPlansComponent,
    MonthPlanComponent,
    NewsListComponent,
    NewsDetailComponent,
    UserEditComponent,
    UsersListComponent,
    Dialog,
    PhotogalleryComponent,
    DocumentsComponent,
    AddDocumentComponent,
    UploadComponent,
    AddPhotoComponent
  ],
  entryComponents: [
    Dialog
  ],
  providers: [
    CookieService,
    UserService,
    FireStorageService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
