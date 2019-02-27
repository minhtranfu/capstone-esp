import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";

export function register(contractor) {
  return async dispatch => {
    const res = await axios.post(`contractors`, contractor);

    dispatch({
      type: Actions.CONTRACTOR_REGISTER_SUCCESS
    });
  };
}

export function updateContractorDetail(contractorId, contractor) {
  return async dispatch => {
    const res = await axios.put(`contractors/${contractorId}`, contractor);

    dispatch({
      type: Actions.UPDATE_CONTRACTOR_SUCCESS
    });
  };
}

export function getContractorDetail(contractorId) {
  return async dispatch => {
    const res = await axios.get(`contractors/${contractorId}`);
    dispatch({
      type: Actions.GET_CONTRACTOR_SUCCESS,
      payload: res.data
    });
  };
}

export function getConstructionList(contractorId) {
  return async dispatch => {
    const res = await axios.get(`contractors/${contractorId}/constructions`);
    dispatch({
      type: Actions.GET_CONSTRUCTION_SUCCESS,
      payload: res.data
    });
  };
}

export function createConstruction(contractorId, construction) {
  return async dispatch => {
    const res = await axios.post(
      `contractors/${contractorId}/constructions`,
      construction
    );
    dispatch({
      type: Actions.CREATE_CONSTRUCTION_SUCCESS,
      payload: res.data
    });
  };
}

export function updateConstruction(contractorId, constructionId, construction) {
  return async dispatch => {
    const res = await axios.put(
      `contractors/${contractorId}/constructions/${constructionId}`,
      construction
    );

    dispatch({
      type: Actions.UPDATE_CONSTRUCTION_SUCCESS
    });
  };
}

export function deleteConstruction(contractorId, constructionId) {
  return async dispatch => {
    const res = await axios.delete(
      `contractors/${contractorId}/constructions/${constructionId}`
    );
    dispatch({
      type: Actions.DELETE_CONSTRUCTION_SUCCESS
    });
  };
}
