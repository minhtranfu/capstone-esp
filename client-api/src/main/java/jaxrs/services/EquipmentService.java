package jaxrs.services;

import entities.AdditionalSpecsFieldEntity;
import daos.ConstructorDAO;
import daos.EquipmentDAO;
import daos.EquipmentTypeDAO;
import dtos.EquipmentDTO;
import dtos.MessageDTO;
import entities.ConstructorEntity;
import entities.EquipmentEntity;
import entities.EquipmentTypeEntity;
import entities.LocationEntity;
import utils.CommonUtils;
import utils.DBUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentService {

	private static final EquipmentDAO equipmentDAO = new EquipmentDAO();
	private static final EquipmentTypeDAO equipmentTypeDAO = new EquipmentTypeDAO();
	private static final ConstructorDAO constructorDAO = new ConstructorDAO();


	@GET
	public Response searchEquipment(
			@QueryParam("lat") double latitude,
			@QueryParam("long") double longitude,
			@QueryParam("begin_date") Date beginDate,
			@QueryParam("end_date") Date endDate,
			@QueryParam("lquery") @DefaultValue("") String locationQuery) {

		if (beginDate == null || endDate == null) {
			// return all
			List<EquipmentEntity> equipmentEntities = equipmentDAO.getAll("EquipmentEntity.getAll");
			return CommonUtils.responseFilterOk(equipmentEntities);

		}
		List<EquipmentEntity> equipmentEntities = equipmentDAO.searchEquipment(beginDate, endDate);
		List<EquipmentDTO> result = new ArrayList<EquipmentDTO>();

		for (EquipmentEntity equipmentEntity : equipmentEntities) {
			EquipmentDTO equipmentDTO = new EquipmentDTO(equipmentEntity, new LocationEntity(locationQuery, longitude, latitude));
			result.add(equipmentDTO);
		}
		return CommonUtils.responseFilterOk(result);
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipment(@PathParam("id") long id) {
		return CommonUtils.responseFilterOk(EquipmentDAO.getInstance().findByID(id));
	}


	@POST
	public Response postEquipment(EquipmentEntity equipmentEntity) {
		//remove id
		equipmentEntity.setId(0);


		//check for constructor id
		if (equipmentEntity.getConstructor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("constructor is null"));
			return CommonUtils.addFilterHeader(responseBuilder).build();

		}
		long constructorId = equipmentEntity.getConstructor().getId();

		ConstructorEntity foundConstructor = constructorDAO.findByID(constructorId);
		if (foundConstructor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("constructor not found"));
			return CommonUtils.addFilterHeader(responseBuilder).build();
		}


		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("equipment_type is null"));
			return CommonUtils.addFilterHeader(responseBuilder).build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("equipment_type not found"));
			return CommonUtils.addFilterHeader(responseBuilder).build();
		}


		equipmentEntity.setConstructor(foundConstructor);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		equipmentDAO.persist(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.CREATED).entity(equipmentEntity);
		return CommonUtils.addFilterHeader(builder).build();


	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateEquipmentById(EquipmentEntity equipmentEntity) {
		equipmentDAO.merge(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.OK).entity(equipmentEntity);

		return CommonUtils.addFilterHeader(builder).build();
	}


	@GET
	@Path("/types")
	public List<EquipmentTypeEntity> getEquipmentTypes() {
		DBUtils.getEntityManager().createNamedQuery("EquipmentTypeEntity.getAllEquipmentType").getResultList();
		List<EquipmentTypeEntity> result = equipmentTypeDAO.getAll("EquipmentTypeEntity.getAllEquipmentType");
	}
		return result;

	@GET
	@Path("/types/{id : \\d+}/specs")
	@Produces(MediaType.APPLICATION_JSON)
	public List<AdditionalSpecsFieldEntity> getEquipmentTypeSpecs(@PathParam("id") int id) {

        List<AdditionalSpecsFieldEntity> resultList = DBUtils.getEntityManager().createQuery("SELECT eti FROM AdditionalSpecsFieldEntity eti WHERE eti.equipmentTypeId = ?", AdditionalSpecsFieldEntity.class).setParameter(1, id).getResultList();

		return resultList;
	}
}
