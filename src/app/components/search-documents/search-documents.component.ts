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

  constructor(readonly documentService: DocumentService, readonly router: Router){ }

  ngOnInit(): void {
  }

  searchDocuments($event: any): void {
    const query: string = $event.query;
    this.documentService.search({term: "properties.cm:name", value: query}).subscribe(result => {
      this.matchingQueryDocuments = result;
    });
  }

  getSuggestionsLabels(entry: SearchResultEntry): {name: string, icon: string} {
    return { name: entry.properties['cm:name'], icon: entry.type == "cm:directory" ? "pi-folder" : "pi-file" };
  }

  onSelect(selectedNodeEntry: SearchResultEntry) {
    this.selectedItem = null;
    this.documentService.getNodeWithParents(String(selectedNodeEntry.dbId)).subscribe(selectedNode => {
      if (this.documentService.isNodeTypeDirectory(selectedNode)) {
        this.openDirectory(selectedNode.id);
      } else {
        this.openDirectory(selectedNode.parentId);
      }
    });
  }

  openDirectory(nodeId: number): void {
    this.router.navigate(['/'], { queryParams: { nodeId: nodeId }, queryParamsHandling: 'merge' });
  }

}
