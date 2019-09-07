import { Component, OnInit  } from '@angular/core';
import {
  ToastController,
  Platform,
  LoadingController,
  AlertController
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

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  
  map: GoogleMap;
  loading: any;
  marker: Marker;
  position: LatLng[];
  markerArray: any[] = [];

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    public alertController:AlertController,
    public storage: Storage) { }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.initializeMap();
  }

  initializeMap() {
    
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
  }

  async ionViewDidEnter() {
    this.map.clear();
    await this.platform.ready().then( ()=> {      
      console.log("back to Page2");
    });
    await this.loadMap();
  }

  loadMap() {
    
    let coordinates: LatLng = new LatLng( 12.2958, 76.6394 );    
    this.marker = this.map.addMarkerSync({
      title: 'Risk zone',        
      position: coordinates,
      draggable: true,
      animation: GoogleMapsAnimation.BOUNCE
    });

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
            console.log('long click');
            let position = new LatLng(data[0].lat, data[0].lng);             
            this.marker.setPosition(position);
            console.log(position);
            console.log('inside default');
            });    
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
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });

      // add a marker
      this.marker = this.map.addMarkerSync({
        title: 'Risk zone',        
        position: location.latLng,
        draggable:true,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      this.marker.showInfoWindow();
      // show another marker
      this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
          let position = new LatLng(data[0].lat, data[0].lng); 
          this.marker.setPosition(position);
          console.log('inside current location');
          });    
      });
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
      position: 'middle',
      color:"success" 
    });

    toast.present();
  }

  SetDangerLocation() {
    this.markerArray.push(this.marker.getPosition());
    console.log(this.marker.getPosition()); 
    this.storage.set('markerArray', this.markerArray); 
    this.presentAlertPrompt();  
    
  }

  addOneMarker() {
    

  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Enter the Intensity of the zone!!!',
      inputs: [        
        {
          name: 'name1',
          type: 'number',
          min: 1,
          max: 10,
          placeholder:"1-10"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.showToast('Added in Database!!');
          }
        }
      ]
    });

    await alert.present();    
  }
}
