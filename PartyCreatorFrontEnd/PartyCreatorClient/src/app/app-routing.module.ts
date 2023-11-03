import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guards/auth.guard';
import { loggedinGuard } from './guards/loggedin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'test/:id', component: TestComponent },
  { path: 'logowanie', component: LoginComponent , canActivate:[loggedinGuard]},
  { path: 'main', component: MainComponent , canActivate:[authGuard]},
  // Inne trasy
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
