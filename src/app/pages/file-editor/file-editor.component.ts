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

    this.documentService.getOnlyOfficeEditorConfig(this.node).subscribe(config => {
      this.config = config;
      console.log(this.config);
    });

  }

  get ONLYOFFICE_BASE_URL() {
    return environment.ONLYOFFICE_BASE_URL
  }

  onDocumentReady(): void {
    console.log("Document ready !")
  }

}
