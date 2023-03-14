import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IConfig } from '@onlyoffice/document-editor-angular';
import { map } from 'rxjs';
import { DNode, Property } from 'src/app/model/node';
import { DocumentService } from 'src/app/service/document.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.scss']
})
export class FileEditorComponent implements OnInit {

  node: DNode | null = null;

  config: IConfig | null = null;

  get ONLYOFFICE_BASE_URL() {
    return environment.ONLYOFFICE_BASE_URL
  }

  constructor(private aroute: ActivatedRoute, private route: Router, private documentService: DocumentService) { }

  ngOnInit(): void {

    this.aroute.paramMap.pipe(map(() => window.history.state)).subscribe(node => {
      this.node = node;

      if (this.node?.uuid == null || this.node?.properties == null) {
        this.route.navigateByUrl('');
      }

      console.log("document found:")
      console.log(this.node);
      console.log(typeof this.node?.properties);
      const docName = JSON.stringify(this.node?.properties).split(',').find(a => a.includes('cm:name'))?.split(':').reverse()[0].replace('"', "").replace('"', "");
      console.log(docName);

      this.config = {
        document: {
          "fileType": "docx",
          "key": `${this.node?.uuid}`,
          "title": `${docName}`,
          "url": `${environment.BACKEND_BASE_URL}/integration/onlyoffice/document/${this.node?.uuid}/contents`
        },
        documentType: "word",
        editorConfig: {
          "callbackUrl": `${environment.BACKEND_BASE_URL}/integration/onlyoffice/document`
        },
      }

    });

  }

  onDocumentReady(): void {
    console.log("Document ready !")
  }

}
