import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from 'src/app/services/gallery.service';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { PhotoDto } from 'src/app/interfaces/photo-dto';
import { id } from 'date-fns/locale';

@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.css'],
  standalone: true,
  imports: [CommonModule, CarouselModule, ImageModule, DialogModule],
})
export class EventGalleryComponent implements OnInit {
  @Input() eventId = '';
  @Input() images: PhotoDto[] = [];
  imageUrls: string[] = [];
  responsiveOptions: any[] | undefined;
  display: boolean = false;
  selectedImage: string = '';

  onDialogHide() {
    this.display = false;
  }

  showImage(event: MouseEvent, imageUrl: string) {
    event.stopPropagation();
    this.selectedImage = imageUrl;
    this.display = true;
  }

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    console.log('EventGalleryComponent.ngOnInit()');
    console.log(this.images);
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
}
