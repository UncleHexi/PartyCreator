import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpotifyService } from 'src/app/services/spotify.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SpotifyComponent {
  searchControl = new FormControl();
  tracks: any[] = [];
  spotiToken: string | null = null;
  playlistTracks: any[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private toast: NgToastService
  ) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => this.spotifyService.searchTracks(query))
      )
      .subscribe((tracks) => {
        this.tracks = tracks.tracks.items;
      });
  }

  ngOnInit(): void {
    this.spotiToken = this.spotifyService.getToken();
  }

  addToPlaylist(track: any) {
    if (!this.playlistTracks.includes(track)) {
      this.playlistTracks.push(track);
    } else {
      this.toast.error({
        detail: 'ERROR',
        summary: 'Utwór znajduje się już na playliście',
        duration: 3000,
      });
    }
  }

  removeFromPlaylist(index: number) {
    this.playlistTracks.splice(index, 1);
  }
}
