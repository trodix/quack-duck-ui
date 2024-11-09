import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DNode} from "../../model/node";
import {DocumentService} from "../../service/document.service";

@Component({
  selector: 'app-node-info-viewer',
  templateUrl: './node-info-viewer.component.html',
  styleUrls: ['./node-info-viewer.component.scss']
})
export class NodeInfoViewerComponent implements OnInit {

  @Input() selectedNode!: DNode | null;
  @Output() onClose = new EventEmitter<void>();

  constructor(private readonly documentService: DocumentService) { }

  ngOnInit(): void {

  }

  onClosePropViewer() {
    this.onClose.emit();
  }

  getIcon(node: DNode): string {
    return this.documentService.getIcon(node);
  }

}
