import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  faArrowRight = faArrowRight;
  selected: Date | null;

  constructor(private event: EventService) {
    this.selected = null;
  }
  
  ngOnInit(): void {
    
  }

  test(){
    this.event.getMe()
    .subscribe(res=>{
      console.log(res)
    })
  }

}