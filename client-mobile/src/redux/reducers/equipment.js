import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  detail: {},
  list: [],
  listSearch: [],
  listRequesterEquipment: [],
  listSupplierEquipment: []
};

export default function equipmentReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_EQUIPMENT_DETAIL_SUCCESS: {
      return {
        ...state,
        detail: payload
      };
    }
    case Actions.LIST_SUPPLIER_EQUIPMENT_SUCCESS: {
      return {
        ...state,
        listSupplierEquipment: payload
      };
    }
    case Actions.LIST_REQUESTER_EQUIPMENT_SUCCESS: {
      return {
        ...state,
        listRequesterEquipment: payload
      };
    }
    case Actions.ADD_EQUIPMENT: {
      const newEquipment = {
        id: Date.now(),
        ...payload
      };
      return {
        list: [...state.list, newEquipment]
      };
    }
    case Actions.UPDATE_EQUIPMENT: {
      console.log(payload.status);
      return {
        ...state,
        list: state.list.map(item => {
          if (item.id === payload.id)
            return Object.assign({}, item, { status: payload.status });
          return item;
        })
      };
    }
    case Actions.REMOVE_EQUIPMENT:
      return {
        ...state,
        list: state.list.filter(x => x.id !== action.id)
      };
    default:
      return state;
  }
}