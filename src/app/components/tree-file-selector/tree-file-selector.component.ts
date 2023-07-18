import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DNode } from 'src/app/model/node';

@Component({
  selector: 'app-tree-file-selector',
  templateUrl: './tree-file-selector.component.html',
  styleUrls: ['./tree-file-selector.component.scss']
})
export class TreeFileSelectorComponent implements OnInit {

  @Input("nodeList") nodeList$!: Observable<DNode[]>;

  constructor() { }

  ngOnInit(): void {
    this.nodeList$.subscribe(data => console.log(data))
  }

}
