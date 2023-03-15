import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DNode } from 'src/app/model/node';
import { DocumentService } from 'src/app/service/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  nodeList$!: Observable<DNode[]>;

  constructor(private documentService: DocumentService, private route: Router) { }

  ngOnInit(): void {
    this.nodeList$ = this.documentService.getNodesForPath('/fruits');
  }

  edit(node: DNode) {
    localStorage.setItem("onlyoffice_opened_node", JSON.stringify(node));
    window.open(`${window.location.origin}/edit/${node.uuid}`, '_blank', 'noreferrer');
  }

  isOnlyOfficeSupported(node: DNode) {
    return this.documentService.isSupportedByOnlyOffice(node);
  }

}
