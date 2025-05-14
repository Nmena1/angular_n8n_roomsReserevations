export interface CatalogResponse {
  rooms: RoomWrapper[];
  schedule: ScheduleWrapper[];
}

export interface RoomWrapper {
  rooms: Room[];
}

export interface Room {
  row_number: number;
  id_sala: number;
  nombre_sala: string;
}

export interface ScheduleWrapper {
  schedules: Schedule[];
}

export interface Schedule {
  row_number: number;
  id_horario: number;
  inicio: number;
  fin: number;
}
