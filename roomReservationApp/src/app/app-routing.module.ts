import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationFormComponent } from './component/reservation-form/reservation-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'reserva', pathMatch: 'full' },
  { path: 'reserva', component: ReservationFormComponent },
  { path: '**', redirectTo: 'reserva' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
