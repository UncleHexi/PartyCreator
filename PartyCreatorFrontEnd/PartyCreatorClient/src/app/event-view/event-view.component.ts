import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  id: string = "";
  title: string = "";
  dateTime: string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const ID = params.get('id');
      if (ID != null) {
        this.id = ID;
        this.title = params.get('title') || "";
        this.dateTime = params.get('dateTime') || "";
      }
    });
  }
}