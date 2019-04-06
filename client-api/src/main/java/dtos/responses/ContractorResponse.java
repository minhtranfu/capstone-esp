package dtos.responses;

import entities.*;

import java.time.LocalDateTime;
import java.util.List;

public class ContractorResponse {

	private long id;

	private String name;

	private String email;

	private String phoneNumber;
	private String thumbnailImageUrl;

	private ContractorEntity.Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;



//	private List<EquipmentEntity> equipments;
//	private List<MaterialEntity> materials;
	private List<ConstructionEntity> constructions;

//	private List<FeedbackEntity> sentFeedback;
//	private List<FeedbackEntity> receivedFeedback;
//	private List<NotificationDeviceTokenEntity> notificationDeviceTokens;
//	private List<SubscriptionEntity> subscriptionEntities;

//	private List<NotificationEntity> notifications;

	private List<DebrisFeedbackEntity> debrisFeedbacks;
	private int debrisFeedbacksCount;
	private double averageDebrisRating;

	private List<MaterialFeedbackEntity> materialFeedbacks;
	private int materialFeedbacksCount;
	private double averageMaterialRating;


	private List<EquipmentFeedbackEntity> equipmentFeedbacks;
	private double averageEquipmentRating;
	private int equipmentFeedbacksCount;



	public ContractorResponse() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getThumbnailImageUrl() {
		return thumbnailImageUrl;
	}

	public void setThumbnailImageUrl(String thumbnailImageUrl) {
		this.thumbnailImageUrl = thumbnailImageUrl;
	}

	public ContractorEntity.Status getStatus() {
		return status;
	}

	public void setStatus(ContractorEntity.Status status) {
		this.status = status;
	}

	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	public List<DebrisFeedbackEntity> getDebrisFeedbacks() {
		return debrisFeedbacks;
	}

	public void setDebrisFeedbacks(List<DebrisFeedbackEntity> debrisFeedbacks) {
		this.debrisFeedbacks = debrisFeedbacks;
	}

	public int getDebrisFeedbacksCount() {
		return debrisFeedbacksCount;
	}

	public void setDebrisFeedbacksCount(int debrisFeedbacksCount) {
		this.debrisFeedbacksCount = debrisFeedbacksCount;
	}

	public List<ConstructionEntity> getConstructions() {
		return constructions;
	}

	public void setConstructions(List<ConstructionEntity> constructions) {
		this.constructions = constructions;
	}

	public double getAverageDebrisRating() {
		return averageDebrisRating;
	}

	public void setAverageDebrisRating(double averageDebrisRating) {
		this.averageDebrisRating = averageDebrisRating;
	}

	public List<MaterialFeedbackEntity> getMaterialFeedbacks() { 
		return materialFeedbacks;
	}

	public void setMaterialFeedbacks(List<MaterialFeedbackEntity> materialFeedbacks) {
		this.materialFeedbacks = materialFeedbacks;
	}

	public int getMaterialFeedbacksCount() {
		return materialFeedbacksCount;
	}

	public void setMaterialFeedbacksCount(int materialFeedbacksCount) {
		this.materialFeedbacksCount = materialFeedbacksCount;
	}

	public double getAverageMaterialRating() {
		return averageMaterialRating;
	}

	public void setAverageMaterialRating(double averageMaterialRating) {
		this.averageMaterialRating = averageMaterialRating;
	}

	public List<EquipmentFeedbackEntity> getEquipmentFeedbacks() {
		return equipmentFeedbacks;
	}

	public void setEquipmentFeedbacks(List<EquipmentFeedbackEntity> equipmentFeedbacks) {
		this.equipmentFeedbacks = equipmentFeedbacks;
	}

	public double getAverageEquipmentRating() {
		return averageEquipmentRating;
	}

	public void setAverageEquipmentRating(double averageEquipmentRating) {
		this.averageEquipmentRating = averageEquipmentRating;
	}

	public int getEquipmentFeedbacksCount() {
		return equipmentFeedbacksCount;
	}

	public void setEquipmentFeedbacksCount(int equipmentFeedbacksCount) {
		this.equipmentFeedbacksCount = equipmentFeedbacksCount;
	}
}