import qs from 'query-string';
import { DataAccessService } from "Services/data/data-access-service";

export const getMaterialTypeCategories = () => {
  return DataAccessService.get('/generalMaterialTypes');
};

export const getMaterialTypeCategoryById = id => {
  return DataAccessService.get(`/generalMaterialTypes/${id}`);
};

export const getMaterialTypes = () => {
  return DataAccessService.get('/materialTypes');
};

export const getMaterialTypeById = id => {
  return DataAccessService.get(`/materialTypes/${id}`);
};

export const getMaterialById = id => {
  return DataAccessService.get(`/materials/${id}`);
};

export const getMaterialsBySupplierId = (params) => {
  const queryString = qs.stringify(params);
  return DataAccessService.get(`/materials/supplier?${queryString}`);
};

export const searchMaterials = criteria => {
  const queryString = Object.keys(criteria)
  .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(criteria[k]))
  .join('&');

  return DataAccessService.get(`/materials?${queryString}`);
};

export const postMaterial = material => {
  return DataAccessService.post('/materials', material);
};

export const updateMaterial = (id, material) => {
  return DataAccessService.put(`/materials/${id}`, material);
};

export const deleteMaterial = id => {
  return DataAccessService.delete(`/materials/${id}`);
};
