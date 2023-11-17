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
  private map: L.Map | undefined; // Dodajemy zmienną do przechowywania instancji mapy

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventAddress'] && !changes['eventAddress'].firstChange) {
      this.updateMap();
    }
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
  
      // Usuwamy poprzednie markery
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
  
      // Jeśli masz adres, użyj geokodera, aby znaleźć współrzędne
      if (this.eventAddress) {
        provider.search({ query: this.eventAddress })
          .then((result: any) => {
            console.log('Geocoding Result:', result);
  
            if (result.length > 0) {
              const { x, y } = result[0];
              const marker = L.marker([y, x]);
              
              // Dodajemy marker do mapy tylko jeśli mapa istnieje
              if (this.map) {
                marker.addTo(this.map);
                this.map.setView([y, x], 15);
              } else {
                console.error('Map is undefined');
              }
            } else {
              console.error('Failed to find coordinates for address:', this.eventAddress);
            }
          })
          .catch((error: any) => {
            console.error('Error during geocoding:', error);
          });
      }
    }
  }
}