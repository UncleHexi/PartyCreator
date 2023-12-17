import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from 'src/app/services/gallery.service';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { PhotoDto } from 'src/app/interfaces/photo-dto';

import { id } from 'date-fns/locale';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.css'],
  standalone: true,
  imports: [MatButtonModule, CommonModule, CarouselModule, ImageModule, DialogModule, MatIconModule],
})
export class EventGalleryComponent implements OnInit {
  @Input() eventId = '';
  @Input() images: PhotoDto[] = [];
  @Input() numVisible: number = 0;
  @Input() imagesNum: number = 0;
  imageUrls: string[] = [];
  responsiveOptions: any[] | undefined;
  display: boolean = false;
  selectedImage: string = '';
  autoplay: number = 3000;
  loaded: boolean = false;

  AutoPlay() {
    if (this.imagesNum < 4) {
      this.autoplay = 0;
    } else {
      this.autoplay = 3000;
    }
    this.loaded = false;
    setTimeout(() => {
      this.loaded = true;
    }, 0);
  }

  onDialogHide() {
    this.display = false;
  }

  showImage(event: MouseEvent, imageUrl: string) {
    event.stopPropagation();
    this.selectedImage = imageUrl;
    this.display = true;
  }

  constructor(
    private galleryService: GalleryService,
    private toast: NgToastService ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imagesNum']) {
      this.AutoPlay();
    }
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
  deleteImage() {
    if (this.selectedImage) {
      const imageId = this.images.find((img) => img.image === this.selectedImage)?.id;
      if (imageId) {
        this.galleryService.DeleteImage(imageId).subscribe(
          () => {
            console.log('Zdjęcie usunięte pomyślnie');
            this.display = false;
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Zdjęcie zostało usunięte!',
              duration: 3000,
            });
          },
          (error) => {
            console.error('Błąd podczas usuwania zdjęcia:', error);
            this.toast.error({
              detail: 'ERROR',
              summary: 'Zdjęcie nie zostało usunięte, nie jesteś organizatorem ani nie dodałeś tego zdjęcia!',
              duration: 3000,
            });
          }
        ); 
      
      }
      
    }
  }
}
