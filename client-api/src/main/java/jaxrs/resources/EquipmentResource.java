package jaxrs.resources;

import daos.*;
import dtos.responses.EquipmentResponse;
import dtos.wrappers.LocationWrapper;
import dtos.responses.MessageResponse;
import entities.*;
import utils.CommonUtils;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentResource {

	@Inject
	@Default
	@Any
	EquipmentDAO equipmentDAO;
	@Inject
	EquipmentTypeDAO equipmentTypeDAO;

	@Inject
	ContractorDAO contractorDAO;
	@Inject
	ConstructionDAO constructionDAO;

	@Inject
	AdditionalSpecsFieldDAO additionalSpecsFieldDAO;


	/*========Constants============*/
//	Nghia's house address
	private static final String DEFAULT_LAT = "10.806488";
	private static final String DEFAULT_LONG = "106.676364";
	private static final String DEFAULT_RESULT_LIMIT = "1000";

	private static final String REGEX_ORDERBY = "(\\w+\\.(asc|desc)($|,))+";

	@GET
	public Response searchEquipment(
			@QueryParam("lat") @DefaultValue(DEFAULT_LAT) double latitude,
			@QueryParam("long") @DefaultValue(DEFAULT_LONG) double longitude,
			@QueryParam("beginDate") @DefaultValue("") String beginDateStr,
			@QueryParam("endDate") @DefaultValue("") String endDateStr,
			@QueryParam("equipmentTypeId") @DefaultValue("0") long equipmentTypeId,
			@QueryParam("lquery") @DefaultValue("") String locationQuery,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		// TODO: 2/14/19 validate orderBy pattern
		if (!orderBy.matches(REGEX_ORDERBY)) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("orderBy param format must be " + REGEX_ORDERBY)).build();
		}

		LocalDate beginDate = null;
		LocalDate endDate = null;
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		if (!beginDateStr.isEmpty() && !endDateStr.isEmpty()) {


//			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-mm-dd");
			try {
				beginDate = LocalDate.parse(beginDateStr, dateTimeFormatter);
				endDate = LocalDate.parse(endDateStr, dateTimeFormatter);

			} catch (DateTimeParseException e) {
				e.printStackTrace();

				// TODO: 2/12/19 always return somethings even when format is shit for risk preventing

				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Date format must be yyyy-MM-dd")).build();
			}
			if (beginDate.isAfter(endDate)) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Error: beginDate > endDate")).build();

			}
		}


		List<EquipmentEntity> equipmentEntities = equipmentDAO.searchEquipment(
				beginDate, endDate,
				equipmentTypeId,
				orderBy,
				offset,
				limit);
//		List<EquipmentEntity> equipmentEntities = equipmentDAO.getAll("EquipmentEntity.getAll");

		List<EquipmentResponse> result = new ArrayList<EquipmentResponse>();

		for (EquipmentEntity equipmentEntity : equipmentEntities) {
			EquipmentResponse equipmentResponse = new EquipmentResponse(equipmentEntity
					, new LocationWrapper(locationQuery, longitude, latitude)
			);
			result.add(equipmentResponse);
		}
		return Response.ok(result).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipment(@PathParam("id") long id) {
		return Response.ok(equipmentDAO.findByID(id)).build();
	}


	@PUT
	@Path("{id:\\d+}")
	public Response updateEquipmentById(@PathParam("id") long id, EquipmentEntity equipmentEntity) {


		if (equipmentEntity == null) {
			return CommonUtils.responseFilterBadRequest(new MessageResponse("no equipment information"));
		}
		equipmentEntity.setId(id);

		EquipmentEntity foundEquipment = equipmentDAO.findByID(id);
		if (foundEquipment == null) {
			return CommonUtils.responseFilterBadRequest(new MessageResponse("Not found equipment with id=" + id));
		}

		if (equipmentEntity.getLatitude() == null) {
			equipmentEntity.setLatitude(Double.parseDouble(DEFAULT_LAT));
		}

		if (equipmentEntity.getLongitude() == null) {
			equipmentEntity.setLongitude(Double.parseDouble(DEFAULT_LONG));
		}


		//check for constructor id
		if (equipmentEntity.getContractor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor is null"));
			return responseBuilder.build();

		}
		long constructorId = equipmentEntity.getContractor().getId();

		ContractorEntity foundContractor = contractorDAO.findByID(constructorId);
		if (foundContractor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor not found"));
			return responseBuilder.build();
		}

		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType is null"));
			return responseBuilder.build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType not found"));
			return responseBuilder.build();
		}


		//check construction
		if (equipmentEntity.getConstruction() != null) {
			long constructionId = equipmentEntity.getConstruction().getId();
			ConstructionEntity foundConstructionEntity = constructionDAO.findByID(constructionId);
			if (foundConstructionEntity == null) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("construction id=%d not found", constructionId))).build();
			}

			//todo validate
			if (foundConstructionEntity.getContractor().getId() != equipmentEntity.getContractor().getId()) {
				return Response.status(Response.Status.BAD_REQUEST).entity
						(new MessageResponse(String.format("construction id=%d not belongs to contractor id=%d"
								, constructionId
								, foundContractor.getId()))).build();
			}
		}



		//todo validate for additionalSpecsValues
		if (equipmentEntity.getAdditionalSpecsValues() != null) {

			for (AdditionalSpecsValueEntity additionalSpecsValueEntity : equipmentEntity.getAdditionalSpecsValues()) {
				AdditionalSpecsFieldEntity foundAdditionalSpecsFieldEntity = additionalSpecsFieldDAO.findByID(additionalSpecsValueEntity.getAdditionalSpecsField().getId());
				if (foundAdditionalSpecsFieldEntity == null) {
					return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("AdditionalSpecsField id=%d not found", additionalSpecsValueEntity.getAdditionalSpecsField().getId()))).build();
				}

				//remove id for persist transaction
				additionalSpecsValueEntity.setId(0);

				//validate datatype
				switch (foundAdditionalSpecsFieldEntity.getDataType()) {
					case STRING:
						break;
					case DOUBLE:
						try {
							Double.parseDouble(additionalSpecsValueEntity.getValue());
						} catch (NumberFormatException e) {
							return Response.status(Response.Status.BAD_REQUEST)
									.entity(new MessageResponse(
											String.format("AdditionalSpecsField value=%s is not %s"
													, additionalSpecsValueEntity.getValue()
													, foundAdditionalSpecsFieldEntity.getDataType())
									)).build();
						}

						break;
					case INTEGER:
						try {
							Integer.parseInt(additionalSpecsValueEntity.getValue());
						} catch (NumberFormatException e) {
							return Response.status(Response.Status.BAD_REQUEST)
									.entity(new MessageResponse(
											String.format("AdditionalSpecsField value=%s is not %s"
													, additionalSpecsValueEntity.getValue()
													, foundAdditionalSpecsFieldEntity.getDataType())
									)).build();
						}
						break;
				}
			}
		}


		//delete all children of the old equipment
//		foundEquipment.deleteAllAvailableTimeRange();

		// validate time range begin end correct
		if (!equipmentDAO.validateBeginEndDate(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("beginDate > endDate !!!"));
			return responseBuilder.build();
		}

		// validate time range not intersect !!!
		if (!equipmentDAO.validateNoIntersect(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("TimeRanges must not be intersect !!!"));
			return responseBuilder.build();
		}
//		equipmentDAO.merge(foundEquipment);


		//todo delete image
		//todo delete location
		//todo delete construction
		;
		//add all children from new equipment
		equipmentEntity.setStatus(foundEquipment.getStatus());

		equipmentDAO.merge(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.OK).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		);
		return CommonUtils.addFilterHeader(builder).build();
	}


	@POST
	public Response postEquipment(EquipmentEntity equipmentEntity) {
		//clean equipment entity

		//remove id
		equipmentEntity.setId(0);

		//remove status
		equipmentEntity.setStatus(null);

		if (equipmentEntity.getLatitude() == null) {
			equipmentEntity.setLatitude(Double.parseDouble(DEFAULT_LAT));
		}

		if (equipmentEntity.getLongitude() == null) {
			equipmentEntity.setLongitude(Double.parseDouble(DEFAULT_LONG));
		}


		//check for constructor id
		if (equipmentEntity.getContractor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor is null"));
			return responseBuilder.build();

		}
		long constructorId = equipmentEntity.getContractor().getId();

		ContractorEntity foundContractor = contractorDAO.findByID(constructorId);
		if (foundContractor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor not found"));
			return responseBuilder.build();
		}

		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType is null"));
			return responseBuilder.build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType not found"));
			return responseBuilder.build();
		}

		//check construction
		if (equipmentEntity.getConstruction() != null) {
			long constructionId = equipmentEntity.getConstruction().getId();
			ConstructionEntity foundConstructionEntity = constructionDAO.findByID(constructionId);
			if (foundConstructionEntity == null) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("construction id=%d not found", constructionId))).build();
			}

			//todo validate
			if (foundConstructionEntity.getContractor().getId() != equipmentEntity.getContractor().getId()) {
				return Response.status(Response.Status.BAD_REQUEST).entity
						(new MessageResponse(String.format("construction id=%d not belongs to contractor id=%d"
								, constructionId
								, foundContractor.getId()))).build();
			}
		}

		// TODO: 2/19/19 add available time ranges
		for (AvailableTimeRangeEntity availableTimeRange : equipmentEntity.getAvailableTimeRanges()) {
			availableTimeRange.setEquipment(equipmentEntity);
		}

		// TODO: 2/19/19 add addtionalsepecs
		for (AdditionalSpecsValueEntity additionalSpecsValue : equipmentEntity.getAdditionalSpecsValues()) {
			additionalSpecsValue.setEquipment(equipmentEntity);
		}


		//todo validate for additionalSpecsValues
		for (AdditionalSpecsValueEntity additionalSpecsValueEntity : equipmentEntity.getAdditionalSpecsValues()) {
			AdditionalSpecsFieldEntity foundAdditionalSpecsFieldEntity = additionalSpecsFieldDAO.findByID(additionalSpecsValueEntity.getAdditionalSpecsField().getId());
			if (foundAdditionalSpecsFieldEntity == null) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("AdditionalSpecsField id=%d not found", additionalSpecsValueEntity.getAdditionalSpecsField().getId()))).build();
			}

			//remove id for persist transaction
			additionalSpecsValueEntity.setId(0);

			//validate datatype
			switch (foundAdditionalSpecsFieldEntity.getDataType()) {
				case STRING:
					break;
				case DOUBLE:
					try {
						Double.parseDouble(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						return Response.status(Response.Status.BAD_REQUEST)
								.entity(new MessageResponse(
										String.format("AdditionalSpecsField value=%s is not %s"
												, additionalSpecsValueEntity.getValue()
												, foundAdditionalSpecsFieldEntity.getDataType())
								)).build();
					}

					break;
				case INTEGER:
					try {
						Integer.parseInt(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						return Response.status(Response.Status.BAD_REQUEST)
								.entity(new MessageResponse(
										String.format("AdditionalSpecsField value=%s is not %s"
												, additionalSpecsValueEntity.getValue()
												, foundAdditionalSpecsFieldEntity.getDataType())
								)).build();
					}
					break;
			}
		}

		//validate time range begin end correct
		if (!equipmentDAO.validateBeginEndDate(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("TimeRange: beginDate must <= endDate !!!"));
			return responseBuilder.build();
		}

		//validate time range not intersect !!!
		if (!equipmentDAO.validateNoIntersect(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("TimeRanges must not be intersect !!!"));
			return responseBuilder.build();
		}

		equipmentEntity.setContractor(foundContractor);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		equipmentDAO.persist(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.CREATED).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		);
		return builder.build();


	}


//
//	@GET
//	@Path("/types")
//	public Response getEquipmentTypes() {
////        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();
//
//
//		DBUtils.getEntityManager().createNamedQuery("EquipmentTypeEntity.getAllEquipmentType").getResultList();
//		List<EquipmentTypeEntity> result = equipmentTypeDAO.getAll("EquipmentTypeEntity.getAllEquipmentType");
//		return CommonUtils.responseFilterOk(result);
//	}


	@PUT
	@Path("{id:\\d+}/status")
	public Response updateEquipmentStatus(@PathParam("id") long id, EquipmentEntity entity) {

		EquipmentEntity foundEquipment = equipmentDAO.findByID(id);
		if (foundEquipment == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("id not found!")).build();
		}
		EquipmentEntity.Status status = entity.getStatus();
		switch (status) {
			case AVAILABLE:
				//cant change to this status because already implemented in Finish Transaction
				return Response.status(Response.Status.BAD_REQUEST).entity
						(new MessageResponse("Not allowed to change to " + status))
						.build();
			case DELIVERING:
				//cant change to this status because already implemented in Process Transaction
				return Response.status(Response.Status.BAD_REQUEST).entity
						(new MessageResponse("Not allowed to change to " + status))
						.build();
			case RENTING:
				if (foundEquipment.getStatus() != EquipmentEntity.Status.DELIVERING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse(String.format("Invalid! Cannot change status from %s to %s ", foundEquipment.getStatus(), status)))
							.build();
				}
				break;
			case WAITING_FOR_RETURNING:
				// TODO: 2/1/19 change this status by system not user
				if (foundEquipment.getStatus() != EquipmentEntity.Status.RENTING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse(String.format("Invalid! Cannot change status from %s to %s ", foundEquipment.getStatus(), status)))
							.build();
				}
				break;

		}

		foundEquipment.setStatus(entity.getStatus());
		equipmentDAO.merge(foundEquipment);
		return Response.ok(equipmentDAO.findByID(id)).build();

	}


}