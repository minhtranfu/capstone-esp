package dtos.responses;

import dtos.wrappers.LocationWrapper;
import entities.*;


/*It's not useless, it have getDistance!*/
public class EquipmentResponse {
	private EquipmentEntity equipmentEntity;

	private LocationWrapper currentLocation;

	public EquipmentResponse(EquipmentEntity equipmentEntity, LocationWrapper currentLocation) {
		this.equipmentEntity = equipmentEntity;
		this.currentLocation = currentLocation;
	}

	public EquipmentEntity getEquipmentEntity() {
		return equipmentEntity;
	}

	public void setEquipmentEntity(EquipmentEntity equipmentEntity) {
		this.equipmentEntity = equipmentEntity;
	}

	public double getDistance() {
		return calculateDistance(this.currentLocation,
				new LocationWrapper(equipmentEntity.getFinalAddress(), equipmentEntity.getFinalLatitude(), equipmentEntity.getFinalLongitude()));
	}


	public LocationWrapper getCurrentLocation() {
		return currentLocation;
	}

	public void setCurrentLocation(LocationWrapper currentLocation) {
		this.currentLocation = currentLocation;
	}

	public double calculateDistance(LocationWrapper location1, LocationWrapper location2) {
		// TODO: 1/24/19 calculateTheta distance


//		return Math.sqrt(Math.pow(location1.getLatitude() - location2.getLatitude(), 2)
//				+ Math.pow(location1.getLongitude() - location2.getLongitude(), 2));

		return distance(location1.getLatitude(), location1.getLongitude(), location2.getLatitude(), location2.getLongitude(), 'K');
	}

	private double distance(double lat1, double lon1, double lat2, double lon2, char unit) {
		double theta = lon1 - lon2;
		double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		dist = Math.acos(dist);
		dist = rad2deg(dist);
		dist = dist * 60 * 1.1515;
		if (unit == 'K') {
			dist = dist * 1.609344;
		} else if (unit == 'N') {
			dist = dist * 0.8684;
		}
		return (dist);
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	/*::  This function converts decimal degrees to radians             :*/
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	private double deg2rad(double deg) {
		return (deg * Math.PI / 180.0);
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	/*::  This function converts radians to decimal degrees             :*/
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	private double rad2deg(double rad) {
		return (rad * 180.0 / Math.PI);
	}
}
