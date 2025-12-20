import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HomeComponent,
    MainRoutingModule
  ]
})
export class MainModule { }
