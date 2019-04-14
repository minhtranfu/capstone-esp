package com.ccp.webadmin.entities;

import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Where(clause = "is_deleted = 0")
public class EquipmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Name is required not empty")
    @Size(min = 3, message = "Equipment's name required more than 3 letters")
    @Column(name = "name")
    private String name;


    @Column(name = "daily_price")
    private Double dailyPrice;

    @Column(name = "description", nullable = true, length = -1, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    @Column(name = "address")
    private String address;

    @Column(name = "`long`")
    private Double longitude;

    @Column(name = "lat")
    private Double lat;

    @ManyToOne
    @JoinColumn(name = "equipment_type_id")
    private EquipmentTypeEntity equipmentTypeEntity;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private ContractorEntity contractorEntity;

//    @Basic
//    @Column(name = "construction_id")
//    public Integer getConstructionId() {
//        return constructionId;
//    }


//    @Basic
//    @Column(name = "description_image_id")
//    public Integer getDescriptionImageId() {
//        return descriptionImageId;
//    }
//
//    public void setDescriptionImageId(Integer descriptionImageId) {
//        this.descriptionImageId = descriptionImageId;
//    }


    public EquipmentEntity() {
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Double dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public EquipmentTypeEntity getEquipmentTypeEntity() {
        return equipmentTypeEntity;
    }

    public void setEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity) {
        this.equipmentTypeEntity = equipmentTypeEntity;
    }

    public ContractorEntity getContractorEntity() {
        return contractorEntity;
    }

    public void setContractorEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public enum Status {
        AVAILABLE("Available"),
        DELIVERING("Delivering"),
        RENTING("Renting"),
        WAITING_FOR_RETURNING("Waiting for returning"),
        ;

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}