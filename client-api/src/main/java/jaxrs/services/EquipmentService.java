package jaxrs.services;

import dao.EquipmentDAO;
import entities.Equipment;
import entities.EquipmentType;
import entities.EquipmentTypeInfo;
import utils.CommonUtils;
import utils.DBUtils;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentService {
    private static EntityManager manager = DBUtils.getEntityManager();

    private static final EquipmentDAO equipmentDAO =  new EquipmentDAO();


	@GET
	@Path("{id:\\d+}")
	public Response getEquipmentById(@PathParam("id") long id) {

		Equipment equipment = equipmentDAO.findByID(id);
		return CommonUtils.responseFilter(equipment);
	}



    @GET
    @Path("/types")
    public Response getEquipmentTypes() {
        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();
        return CommonUtils.responseFilter(resultList);
    }

    @GET
    @Path("/types/{id : \\d+}/infos")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEquipmentTypeInfos(@PathParam("id") int id) {

        List<EquipmentTypeInfo> resultList = manager.createQuery("SELECT eti FROM EquipmentTypeInfo eti WHERE eti.equipmentTypeId = ? ORDER BY eti.weight", EquipmentTypeInfo.class).setParameter(1, id).getResultList();

        return CommonUtils.responseFilter(resultList);
    }
}
