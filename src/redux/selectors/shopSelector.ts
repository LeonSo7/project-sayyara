import { IShopState } from "@redux/state/shop/shopState";
import { createSelector } from "reselect";
import { RootState } from "../store";

const getShopState = (state: RootState): IShopState => state.shop;

const getShopEmployees = createSelector(
  getShopState,
  (shopState) => shopState.employees
);

const getShopServices = createSelector(
  getShopState,
  (shopState) => shopState.services
);

const getShopAppointments = createSelector(
  getShopState,
  (shopState) => shopState.appointments
);

export const ShopSelectors = {
  getShopEmployees,
  getShopServices,
  getShopAppointments,
};
