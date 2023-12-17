import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from 'src/app/services/gallery.service';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { PhotoDto } from 'src/app/interfaces/photo-dto';

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

  constructor(private galleryService: GalleryService) {}

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
}
