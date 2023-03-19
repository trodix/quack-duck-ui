import { Component, Input, OnInit } from '@angular/core';

export interface Item {
  label: string;
  styleClass?: string;
  classIcons?: string;
  action?: Function;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input()
  label: string = "";

  @Input()
  styleClass: string = "";

  @Input()
  list: Item[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  itemAction = (fun: Function | undefined) => {
    // FIXME Cannot read properties of undefined (reading 'oauthService')
    if (fun) {
      fun();
    }
  }

}
