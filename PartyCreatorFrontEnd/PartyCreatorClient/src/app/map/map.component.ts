import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import * as leafletGeosearch from 'leaflet-geosearch';

@Component({
  selector: 'app-map',
  template: '<div id="map"></div>',
  styles: ['#map { height: 540px; border-radius:15px;}']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() eventAddress: string = '';
  private map: L.Map | undefined;
  private mapVisible: boolean = true;

  private markerIcon = new L.Icon({
    iconUrl: 'assets/myMarker/marker-icon.png',
    shadowUrl: 'assets/myMarker/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventAddress'] && !changes['eventAddress'].isFirstChange()) {
      this.updateMap();
    }
    if (changes['mapVisible'] && !changes['mapVisible'].firstChange) {
      if (this.mapVisible) {
        this.initMap();
        this.updateMap();
      } else {
        if (this.map) {
          this.map.remove();
        }
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      this.updateMap();
    }, 0);
  }


  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }
  private updateMap(): void {
    if (this.map) {
      const provider = new leafletGeosearch.OpenStreetMapProvider();
  
      // Zapamiętaj wartość eventAddress przed rozpoczęciem geokodowania
      const currentEventAddress = this.eventAddress;
  
      // Usuwamy tylko warstwy markerów
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
  
      if (currentEventAddress) {
        provider.search({ query: currentEventAddress })
          .then((result: any) => {
            // Sprawdź, czy eventAddress się nie zmienił
            if (this.eventAddress === currentEventAddress) {
              console.log('Geocoding Result:', result);
  
              if (result.length > 0) {
                const { x, y } = result[0];
                const marker = L.marker([y, x], { icon: this.markerIcon });
  
                if (this.map) {
                  this.map.setView([y, x], 15);
  
                  marker.addTo(this.map);
                  marker.bindPopup(currentEventAddress).openPopup();
                } else {
                  console.error('Map is undefined');
                }
              } else {
                console.error('Failed to find coordinates for address:', currentEventAddress);
                // Dodaj odpowiedni kod, aby wyświetlić komunikat o błędzie (np. Angular Material Dialog)
                console.log('Mapa nie potrafila znalezc tego adresu.');
              }
            } else {
              console.log('Event address changed during geocoding. Ignoring results.');
            }
          })
          .catch((error: any) => {
            console.error('Error during geocoding:', error);
            // Dodaj odpowiedni kod, aby wyświetlić komunikat o błędzie (np. Angular Material Dialog)
            console.log('Mapa nie potrafila znalezc tego adresu.');
          });
      }
    } else {
      console.error('Map is undefined');
    }
  }
}  