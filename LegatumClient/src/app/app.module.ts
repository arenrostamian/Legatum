import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ContractFormComponent } from './contract-form/contract-form.component';
import { MyContractsComponent } from './my-contracts/my-contracts.component';
import { ContractPreviewComponent } from './contract-preview/contract-preview.component';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './firebase.config';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { someShizz: 'some interesting data' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        children: [
          {
            path: 'my-contracts',
            component: MyContractsComponent
          },
          {
            path: 'create-contract',
            component: ContractFormComponent
          },
          {
            path: '',
            redirectTo: 'my-contracts', pathMatch: 'full'
          },
        ]
      },
    ]
  },


  {
    path: '**',
    redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'home', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    ContractFormComponent,
    MyContractsComponent,
    ContractPreviewComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    FormsModule
  ],
  providers: [AuthGuardService, AuthService, AngularFireAuth, LoginComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
