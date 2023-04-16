import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IConfig } from '@onlyoffice/document-editor-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { DNode } from 'src/app/model/node';
import { UserProfile } from 'src/app/model/userprofile';
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

  constructor(private oauthService: OAuthService, private route: Router, private documentService: DocumentService) { }

  async ngOnInit() {

    const raw = localStorage.getItem("onlyoffice_opened_node");
    if (raw == null) {
      return;
    }

    this.node = JSON.parse(raw);

    if (this.node.id == null || this.node.properties == null) {
      window.close();
    }

    const docName = this.documentService.getNodeName(this.node);
    const userprofile = ((await this.oauthService.loadUserProfile()) as any).info as UserProfile;

    this.config = {
      document: {
        "fileType": this.documentService.getOnlyOfficeFileType(this.node),
        // TODO [key] uuid must be different for each modification of the document https://api.onlyoffice.com/editors/troubleshooting#key
        "key": `${this.node?.id}`,
        "title": `${docName}`,
        "url": `${environment.BACKEND_BASE_URL}/integration/onlyoffice/document/${this.node?.id}/contents`
      },
      documentType: this.documentService.getOnlyOfficeDocumentType(this.node),
      editorConfig: {
        "callbackUrl": `${environment.BACKEND_BASE_URL}/integration/onlyoffice/document`,
        lang: window.navigator.language,
        user: {
          id: userprofile.sub,
          name: userprofile.name,
        }
      },
    }

    console.log(this.config);
    
  }

  get ONLYOFFICE_BASE_URL() {
    return environment.ONLYOFFICE_BASE_URL
  }

  onDocumentReady(): void {
    console.log("Document ready !")
  }

}
