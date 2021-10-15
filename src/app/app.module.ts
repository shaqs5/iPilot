import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";

import { ROUTES } from "./app.routes";
import { AppComponent } from './app.component';

// App views
import { DashboardsModule } from "./views/dashboards/dashboards.module";
import { AppviewsModule } from "./views/appviews/appviews.module";

// App modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";
import { MainComponent } from './views/main/main.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProductcomparisonComponent } from './views/productcomparison/productcomparison.component';

import { DataTablesModule } from 'angular-datatables';
import { DataService } from './data.service';

import { AuthGuardService } from './services/authguards.service'


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    ProductcomparisonComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    DashboardsModule,
    DataTablesModule,
    LayoutsModule,
    AppviewsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, { provide: DataService, useClass: DataService }, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
