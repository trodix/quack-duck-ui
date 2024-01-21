import {Component, Input, OnInit} from '@angular/core';
import {MessageService, TreeNode} from "primeng/api";
import {DocumentService} from "../../service/document.service";
import {DNode} from "../../model/node";

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

  @Input() rootNodeId: number | undefined;
  tree: TreeNode[] | undefined;

  constructor(private documentService: DocumentService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.documentService.getDirectoryTree(this.rootNodeId!).subscribe(data => {
      this.tree = this.documentService.buildTreeComponentData(data);
    });
  }

  selectedNode(event: any) {
    this.documentService.onSelectedNodeFromSideBar.next(event.node.data)
  }

}
