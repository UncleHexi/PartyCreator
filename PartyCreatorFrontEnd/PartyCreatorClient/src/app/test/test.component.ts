import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  id: string ="";

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const ID = params.get('id');
      if(ID != null) {
        this.id = ID;
      }
    });
  }
}
