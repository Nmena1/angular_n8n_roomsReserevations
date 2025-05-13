import { Routes } from '@angular/router';
import { ReservationFormComponent } from './component/reservation-form/reservation-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'reserva', pathMatch: 'full' },
  { path: 'reserva', component: ReservationFormComponent },
  { path: '**', redirectTo: 'reserva' }
];
