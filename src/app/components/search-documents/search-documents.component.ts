import {Component, OnInit} from '@angular/core';
import {DocumentService, SearchResult, SearchResultEntry} from "../../service/document.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-documents',
  templateUrl: './search-documents.component.html',
  styleUrls: ['./search-documents.component.scss']
})
export class SearchDocumentsComponent implements OnInit {

  matchingQueryDocuments: SearchResult | null = null;
  selectedItem = null;

  constructor(readonly documentService: DocumentService, readonly route: Router){ }

  ngOnInit(): void {
  }

  searchDocuments($event: any): void {
    const query: string = $event.query;
    this.documentService.search({term: "properties.cm:name", value: query}).subscribe(result => {
      this.matchingQueryDocuments = result;
    });
  }

  getSuggestionsLabels(entry: SearchResultEntry): string {
    return entry.properties['cm:name'];
  }

  onSelect(selectedNodeEntry: SearchResultEntry) {
    this.selectedItem = null;
    this.documentService.getNodeWithParents(String(selectedNodeEntry.dbId)).subscribe(selectedNode => {
      this.documentService.edit(selectedNode);
    });
  }

}
