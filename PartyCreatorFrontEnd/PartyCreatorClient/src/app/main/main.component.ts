import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../interfaces/event-dto';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  faArrowRight = faArrowRight;
  selected: Date | null;
  myEvents: EventDto[] = [];
  
  constructor(private event: EventService, public dialog: MatDialog, private datePipe: DatePipe) {
    this.selected = null;
  }
  
  ngOnInit(): void {
    this.getMyEvents();
    this.sortMyEvents();
  }

  openDialog() {
    const dialogRef = this.dialog.open(EventModalComponent, {
      panelClass: 'testDialog',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(!!res)
      {
        this.getMyEvents();
      }
    })
  }


  getMyEvents()
  {
    this.event.getOfCreator()
    .subscribe(res=>{
      this.myEvents=res;
      console.log(this.myEvents)
    })

  }

  sortMyEvents()
  {
    //sortowanie
  }
}