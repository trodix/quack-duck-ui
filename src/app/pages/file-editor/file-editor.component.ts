import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IConfig } from '@onlyoffice/document-editor-angular';
import { DNode } from 'src/app/model/node';
import { DocumentService } from 'src/app/service/document.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.scss']
})
export class FileEditorComponent implements OnInit {

  node!: DNode;

  config!: IConfig;

  constructor(private aroute: ActivatedRoute, private route: Router, private documentService: DocumentService) {}

  ngOnInit(): void {

    const raw = localStorage.getItem("onlyoffice_opened_node");
    if (raw == null) {
      return;
    }

    this.node = JSON.parse(raw);

    if (this.node.uuid == null || this.node.properties == null) {
      window.close();
    }

    const docName = this.documentService.getDocumentName(this.node);

    this.config = {
      document: {
        "fileType": this.documentService.getOnlyOfficeFileType(this.node),
        // TODO [key] uuid must be different for each modification of the document https://api.onlyoffice.com/editors/troubleshooting#key
        "key": `${this.node?.uuid}`,
        "title": `${docName}`,
        "url": `${environment.BACKEND_BASE_URL}/integration/onlyoffice/document/${this.node?.uuid}/contents`
      },
      documentType: this.documentService.getOnlyOfficeDocumentType(this.node),
      editorConfig: {
        "callbackUrl": `${environment.BACKEND_BASE_URL}/integration/onlyoffice/document`
      },
    }

  }

  get ONLYOFFICE_BASE_URL() {
    return environment.ONLYOFFICE_BASE_URL
  }

  onDocumentReady(): void {
    console.log("Document ready !")
  }

}
