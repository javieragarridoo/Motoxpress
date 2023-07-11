import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-recogida',
  templateUrl: './loading-recogida.component.html',
  styleUrls: ['./loading-recogida.component.scss'],
})
export class LoadingRecogidaComponent implements OnInit {
  
  dummy = Array(10);

  constructor() { }

  ngOnInit() {}

}
