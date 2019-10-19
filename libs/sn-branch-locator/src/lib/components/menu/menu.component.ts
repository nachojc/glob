import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../services/Network/network.service';

@Component({
  selector: 'sn-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private network: NetworkService) {

  }


  ngOnInit(): void {
    this.network.connectionChange.subscribe((value) => {
      console.log('connection', value);
    });
  }

}
