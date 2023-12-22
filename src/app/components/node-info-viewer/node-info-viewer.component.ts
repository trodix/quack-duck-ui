import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DNode} from "../../model/node";

@Component({
  selector: 'app-node-info-viewer',
  templateUrl: './node-info-viewer.component.html',
  styleUrls: ['./node-info-viewer.component.scss']
})
export class NodeInfoViewerComponent implements OnInit {

  @Input() selectedNode!: DNode | null;
  @Output() onClose = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {

  }

  onClosePropViewer() {
    this.onClose.emit();
  }

}
