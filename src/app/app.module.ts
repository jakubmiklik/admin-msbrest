import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetComponent } from './widget/widget.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MonthPipe } from './month.pipe';
import { DayPipe } from './day.pipe';
import { OmluvenkyComponent } from './omluvenky/omluvenky.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonthPlansComponent } from './month-plans/month-plans/month-plans.component';
import { MonthPlanComponent } from './month-plans/month-plan/month-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    WidgetComponent,
    HomepageComponent,
    MonthPipe,
    DayPipe,
    OmluvenkyComponent,
    MonthPlansComponent,
    MonthPlanComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CKEditorModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
