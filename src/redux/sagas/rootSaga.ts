import { all } from "redux-saga/effects";
import { appointmentSaga } from "./appointmentSaga";
import { authSaga } from "./authSaga";
import { employeeSaga } from "./employeeSaga";
import { quoteSaga } from "./quoteSaga";
import { serviceSaga } from "./serviceSaga";
import { shopSaga } from "./shopSaga";

export function* rootSaga() {
  yield all([
    authSaga(),
    appointmentSaga(),
    shopSaga(),
    employeeSaga(),
    quoteSaga(),
    serviceSaga(),
  ]);
}
