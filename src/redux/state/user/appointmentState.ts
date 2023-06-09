import { ICustomerAppointment } from "src/types/appointment";

export interface IAppointmentsState {
  appointments: ICustomerAppointment[];
}

export const initialAppointmentsState: IAppointmentsState = {
  appointments: [],
};
