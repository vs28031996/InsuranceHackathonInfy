import { Component, ViewChild } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from "@ionic-native/google-maps";

import { Platform, NavController } from "@ionic/angular";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public platform: Platform, public nav: NavController) {}

  ngAfterViewInit() {

		this.platform.ready().then( () => {

			this.loadMap();
		});
  }

  loadMap() {
    
    let map = GoogleMaps.create( 'map' );
  
    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
  
      let coordinates: LatLng = new LatLng( 12.2958, 76.6394 );
  
      let position = {
        target: coordinates,
        zoom: 14
      };
  
      map.animateCamera( position );
  
      let markerOptions: MarkerOptions = {
        position: coordinates,
        icon: "assets/images/marker.png",
        title: 'Danger Zone'
      };
  
      const marker = map.addMarker( markerOptions )
      .then( ( marker: Marker ) => {
        marker.showInfoWindow();
      });
    })
  }

  GetNearestLocation() {
    let map = GoogleMaps.create( 'map' );
  
    map.one( GoogleMapsEvent.MAP_READY ).then( ( data: any ) => {
  
      let coordinates: LatLng = new LatLng( 12.20506 ,76.37078);
  
      let position = {
        target: coordinates,
        zoom: 14
      };
  
      map.animateCamera( position );
  
      let markerOptions: MarkerOptions = {
        position: coordinates,
        icon: "assets/images/marker.png",
        title: 'Danger Zone'
      };
  
      const marker = map.addMarker( markerOptions )
      .then( ( marker: Marker ) => {
        marker.showInfoWindow();
      });
    })    
  }
}
