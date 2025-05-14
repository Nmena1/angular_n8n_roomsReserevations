import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ReservationService } from '../../services/reservation.service';
import { Room, Schedule } from '../../models/catalogs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatProgressBarModule} from  '@angular/material/progress-bar' ;
import { Servation } from '../../models/servation';


@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {

  form: FormGroup;
  
  catalogs: string[] = [];
  rooms: Room[] = [];
  schedules: Schedule[] = [];
  downloading: boolean = false;

  constructor(private readonly fb: FormBuilder, private readonly reservationService: ReservationService) {

    this.form = this.fb.group({

      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      room: ['', Validators.required],
      requestDate: ['', Validators.required],
      schedule: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    
    this.getCatalogs();
    
  }

  getCatalogs() {
    this.downloading = true;
    this.reservationService.getCatalogs().subscribe(
      data => {
        // console.log('Catálogos recibidos:', data);
       
        this.rooms = data.rooms[0]?.rooms || [];
        this.schedules = data.schedule[0]?.schedules || [];

        // console.log(this.rooms);
        // console.log(this.schedules);
        this.downloading = false;
      },
      error => {
        console.error('Error al obtener catálogos', error);
        this.downloading = false;
        
      }
    );

    this.downloading = false;
  }
  
  onSubmit(): void {

    // console.log(this.form.value)
    if(!this.validarEmailGob(this.form.value.email)){
      Swal.fire('Error', 'El Email no corresponde al dominio "@goes.gob.sv"', 'error');
      return;
    }
    
    // console.log("is the form valid? " + this.form.valid);
    this.downloading = true;
    if (this.form.valid) {
      const formData = this.form.value;
      // console.log('Formulario enviado:', formData);
  
      // this.reservationService.submitReservation(formData).subscribe(
      //   response => {
      //     Swal.fire('Éxito', 'Reservación realizada con éxito', 'success');
      //     this.form.reset();

      //     this.downloading = false;
      //     console.log(response.menssage);
      //   },
      //   error => {
      //     Swal.fire('Error', 'Ocurrió un error al guardar la reservación', 'error');
      //     this.downloading = false;
      //   }
      // );
      this.reservationService.submitReservation(formData).subscribe(
        response => {
          if (response.code === 400) {
            Swal.fire('Error', response.message, 'error');
            this.downloading = false;
            return;
          }
          Swal.fire('Éxito', response.message, 'success');
          this.form.reset();
          this.downloading = false;
        },
        error => {
          Swal.fire('Error', 'Error inesperado al enviar la solicitud', 'error');
          this.downloading = false;
        }
      );
      
    } else {
      this.downloading = false;
      Swal.fire('Formulario inválido', 'Por favor completa todos los campos requeridos.', 'warning');
      this.form.markAllAsTouched();
    }
  }

  validarEmailGob(email : string) {
    
    const regex = /^[a-zA-Z0-9._%+-]+@goes\.gob\.sv$/;
    return regex.test(email);
  }

  verifyReservation(model : Servation){

    let timeMdl = this.schedules.filter(x => x.id_horario == Number(model.requestDate));
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const currentTotalMinutes = hours * 60 + minutes;

    // console.log(`Current time: ${hours}:${minutes}:${seconds}`);
    
    if(!this.isValidScheduleDate(model.schedule, 1)){
      Swal.fire('Fecha Inválido', 'Por favor agregue una fecha igual o mayor a este día.', 'warning');
      return;  
    }

    const startHour = timeMdl[0].inicio; // Ej. 10
    const startTotalMinutes = startHour * 60; // Ej. 600 minutos
    const reservationDeadline = startTotalMinutes - 30;
    
    // if ((currentTotalMinutes > reservationDeadline) && (!this.isValidScheduleDate(model.schedule, 0)) ) {
    //   Swal.fire('Reserva inválida', 'La reservación debe hacerse al menos 30 minutos antes del horario seleccionado.', 'warning');
    //   return;
    // }
    
    if (this.isValidScheduleDate(model.schedule, 0)) { // es hoy
      // console.log("136 - es hoy")
      if (currentTotalMinutes > reservationDeadline) {
        Swal.fire('Reserva inválida', 'La reservación debe hacerse al menos 30 minutos antes del horario seleccionado.', 'warning');
        return;
      }
    }else{
      // console.log("142 - no es hoy")
    }
    

    return false;
  }

  parseLocalDate(dateStr : string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  isValidScheduleDate(scheduleDateStr : string, isToday : number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const scheduleDate = this.parseLocalDate(scheduleDateStr);
    scheduleDate.setHours(0, 0, 0, 0);
  
    console.warn(scheduleDate + " - " + today);

    if(isToday == 1){
      // console.log("154 scheduleDate= " + scheduleDate + ", today=" + today)
      return scheduleDate >= today;
    }else if(isToday == 0){
      // console.log("157 scheduleDate= " + scheduleDate + ", today=" + today + ", =>" + (scheduleDate == today))
      // return scheduleDate === today;
      const isSameDay = scheduleDate.getFullYear() === today.getFullYear() &&
                  scheduleDate.getMonth() === today.getMonth() &&
                  scheduleDate.getDate() === today.getDate();

      // console.log("157 scheduleDate=", scheduleDate, ", today=", today, ", =>", isSameDay);
      return isSameDay;

    }
    return true;
  }
 
  
}
