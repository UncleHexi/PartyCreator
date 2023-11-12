import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../interfaces/event-dto';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  faArrowRight = faArrowRight;
  selected: Date | null;
  myEvents: EventDto[] = [];
  
  constructor(private event: EventService, public dialog: MatDialog) {
    this.selected = null;
  }
  
  ngOnInit(): void {
    this.getMyEvents();
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


  test(){
    this.event.getMe()
    .subscribe(res=>{
      console.log(res)
    })
  }

  getMyEvents()
  {
    this.event.getOfCreator()
    .subscribe(res=>{
      this.myEvents=res;
    })
  }

}