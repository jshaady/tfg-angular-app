import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetService } from 'src/app/services/meet.service';
import { IMeet } from 'src/app/interfaces/imeet';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-meet-view',
  templateUrl: './meet-view.component.html',
  styleUrls: ['./meet-view.component.css']
})
export class MeetViewComponent implements OnInit {

  @ViewChild('mapContainer', { static: true }) gmap: ElementRef;

  map: google.maps.Map;
  countdown: any = null;
  id: any;
  private latitude;
  private longitude;

  constructor(private route: ActivatedRoute,
              private meetService: MeetService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.meetService.searchMeet(params['id']);
      this.router.navigate(['/meet', params['id']]);
    });
    this.id = setInterval(() => {
      let countDownDate = new Date(this.getMeet().date).getTime();
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.countdown = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";
    }, 1000);
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.mapInitializer();
    }, 350);
  }

  onDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  openMap(): void {
    // window.location.href = 'https://www.google.es/maps/place/' + this.getMeet().location;
    window.open('https://www.google.es/maps/place/' + this.getMeet().location, '_blank')
  }

  mapInitializer() {
    const geocoder = new google.maps.Geocoder();
    let address = this.getMeet().location;

    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
      }
      let coordinates = new google.maps.LatLng(this.latitude, this.longitude);
      let marker = new google.maps.Marker({
        position: coordinates,
        map: this.map,
      });
      this.map = new google.maps.Map(
        document.getElementById('map'), {
        zoom: 12,
        center: coordinates,
        gestureHandling: 'none',
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        scrollwheel: false,
        fullscreenControl: false,
        rotateControl: false,
        mapTypeControl: false,
        keyboardShortcuts: false,
        draggableCursor: 'default'
      }
      );
      marker.setMap(this.map);
    });
  }

  ngOnDestroy() { }

  getMeet(): IMeet {
    return this.meetService.getMeet();
  }

  isInMeet(): Boolean {
    const user = this.getMeet().usersInMeet.find( user => this.userService.getLoggeduser().username === user.username);
    if (user) return true;
    else return false;
  }

  loggedIn(): Boolean {
    return this.userService.loggedIn();
  }

  joinMeet(): void {
    this.meetService.joinMeet();
  }

  leftMeet(): void {
    this.meetService.leftMeet();
  }

  getUserAvatar(avatarEncode, avatarType): any {
    if (avatarEncode != null && avatarType != null && avatarEncode != undefined && avatarType != undefined){
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,' 
        + avatarEncode);
    }
    else{
      return '../../../../assets/img/default.png';
    }
  }
}
