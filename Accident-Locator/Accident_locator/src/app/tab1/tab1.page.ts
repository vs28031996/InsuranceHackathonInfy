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

import { Platform, NavController, LoadingController } from "@ionic/angular";
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  loading: any;
  map = GoogleMaps.create( 'map' );
  file: MediaObject;
  
  constructor(public platform: Platform, public media:Media, public nav: NavController, public loadingCtrl: LoadingController,) {}

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
    
      
      this.map.getMyLocation().then((location: MyLocation) => {
        this.loading.dismiss();
  
        // Move the map camera to the location with animation
        this.map.animateCamera({
          target: location.latLng,
          zoom: 14
        });
        let coordinates: LatLng= new LatLng(12.359565, 76.603543);
        this.map.setMyLocationEnabled(false);

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

        if (location.latLng) {
        
        }
      })
      .catch(err => {
        this.loading.dismiss();
      });
      setTimeout(() => {this.file = this.media.create('http://download2265.mediafire.com/n5f021r4fhhg/rds803zo84sbs0q/alertme.mp3');
      this.file.play();
      this.file.stop(); }, 1000)
                 
  }
}
