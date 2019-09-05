import { Component, ViewChild } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  MyLocation,
  Circle,
  GoogleMapsAnimation
} from "@ionic-native/google-maps";
import { Storage } from '@ionic/storage';

import { Platform, NavController, LoadingController, AlertController  } from "@ionic/angular";
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  loading: any;
  map = GoogleMaps.create( 'map' );
  file: MediaObject;
  markerArray: any[] = [];
  
  constructor(public platform: Platform, public storage:Storage, public alertCtrl:AlertController, public localNotifications: LocalNotifications, public media:Media, public nav: NavController, public loadingCtrl: LoadingController,) {}

  ngAfterViewInit() {

		this.platform.ready().then( () => {

			this.loadMap();
		});
  }

  async GetNearestLocation() {
    
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();
    this.loading.dismiss();
    
      
      let coordinates: LatLng = new LatLng( 12.2958, 76.6394 );
  
      let position = {
        target: coordinates,
        zoom: 14
      };
  
      this.map.animateCamera( position );
  
      // let markerOptions: MarkerOptions = {
      //   position: coordinates,
      //   icon: "assets/images/marker.png",
      //   title: 'Danger Zone'
      // };
  
      // const marker = map.addMarker( markerOptions )
      // .then( ( marker: Marker ) => {
      //   marker.showInfoWindow();
      // });

      var circle: Circle = this.map.addCircleSync({
        center: coordinates,
        radius: 500,
        strokeColor: "#E16D65",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#00880055",
        fillOpacity: 0,
        strokeWidth: 3,
        title: "Danger Zone"
    });
    
    var direction = 1;
    var rMin = 150, rMax = 500;
    setInterval(function() {
        var radius = circle.getRadius();
        if ((radius > rMax) || (radius < rMin)) {
            direction *= -1;
        }
        circle.setRadius(radius + direction * 10);
    }, 50);

  
  }

  async loadMap() {
       
    this.map.clear();
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();
    
    this.storage.get('markerArray').then((val) => {
      let position = new LatLng(val[0].lat, val[0].lng); 
      var circle1: Circle = this.map.addCircleSync({
        center: position,
        radius: 500,
        strokeColor: "#E16D65",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#00880055",
        fillOpacity: 0,
        strokeWidth: 3,
        title: "Danger Zone"
      });
      var direction = 1;
        var rMin = 150, rMax = 500;
        setInterval(function() {
          var radius = circle1.getRadius();
          if ((radius > rMax) || (radius < rMin)) {
            direction *= -1;
          }
          circle1.setRadius(radius + direction * 10);
        }, 50);
    });
      
      this.map.getMyLocation().then((location: MyLocation) => {
        this.loading.dismiss();
  
        // Move the map camera to the location with animation
        this.map.animateCamera({
          target: location.latLng,
          zoom: 15
        });
        let coordinates: LatLng= new LatLng(12.359565, 76.603543);
        
        var circleCurrentLocation: Circle = this.map.addCircleSync({
          center: location.latLng,
          radius: 20,
          strokeColor: "#3755aa",
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: "#003e8f",
          strokeWidth: 3
        });

        var circle: Circle = this.map.addCircleSync({
          center: coordinates,
          radius: 500,
          strokeColor: "#E16D65",
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: "#00880055",
          fillOpacity: 0,
          strokeWidth: 3,
          title: "Danger Zone"
        });

        var direction = 1;
        var rMin = 150, rMax = 500;
        setInterval(function() {
          var radius = circle.getRadius();
          if ((radius > rMax) || (radius < rMin)) {
            direction *= -1;
          }
          circle.setRadius(radius + direction * 10);
        }, 50);

        if (this.calculateDistance(location.latLng.lat, coordinates.lat, location.latLng.lng, coordinates.lng) <= 0.5) {
          setTimeout(() => {
            this.file = this.media.create('https://raw.githubusercontent.com/vs28031996/Notes-dbms-/master/alertme.mp3');
            this.file.play();
            this.file.stop();
           
            this.localNotifications.schedule({
              led: 'FF0000',
              text: 'You have entered a high risk zone',
              sound: 'file://raw.githubusercontent.com/vs28031996/Notes-dbms-/master/alertme.mp3'
            });
            this.presentAlert();        
        }, 6000)
        }
      })
      .catch(err => {
        this.loading.dismiss();
      });
        
  }
  async presentAlert() {
    let alert = await this.alertCtrl.create({
      header:"Warning",
      subHeader: "You have entered a high risk zone!! Stay Safe!!",
      buttons: ['OK']
    });
    await alert.present();
  }

  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }
}
