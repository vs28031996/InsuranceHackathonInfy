import { Component, OnInit  } from '@angular/core';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  LatLng,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  map: GoogleMap;
  loading: any;
  marker: Marker;
  position: LatLng[];

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform) { }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 12.2958,
          lng: 76.6394 
        },
        zoom: 18,
        tilt: 0
      }
    });

    let coordinates: LatLng = new LatLng( 12.2958, 76.6394 );
    this.marker = this.map.addMarkerSync({
      title: 'Danger zone',        
      position: coordinates,
      draggable:true,
      animation: GoogleMapsAnimation.BOUNCE
    });

  }

  async onButtonClick() {
    this.map.clear();

    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      console.log(JSON.stringify(location, null ,2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });

      // add a marker
      this.marker = this.map.addMarkerSync({
        title: 'Danger zone',        
        position: location.latLng,
        draggable:true,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      this.marker.showInfoWindow();
    })
    .catch(err => {
      this.loading.dismiss();
      this.showToast(err.error_message);
    });
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'middle'
    });

    toast.present();
  }

  GetNearestLocation() {
    this.marker.getPosition();
    this.showToast('Added in Database!!');

  }
}
