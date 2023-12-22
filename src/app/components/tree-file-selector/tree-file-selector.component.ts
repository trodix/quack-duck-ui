import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DNode} from 'src/app/model/node';
import {DocumentService} from "../../service/document.service";
import {map, Observable, tap} from "rxjs";
import {MenuItem} from "primeng/api";
import {PaginationResult} from "../../model/pagination/pagination-result";

@Component({
  selector: 'app-tree-file-selector',
  templateUrl: './tree-file-selector.component.html',
  styleUrls: ['./tree-file-selector.component.scss']
})
export class TreeFileSelectorComponent implements OnInit {

  @Input("rootDirectoryId") rootDirectoryId!: number;
  @Input("actionUponNode") actionUponNode!: DNode;
  selectedDirectory: DNode | null = null;
  openedDirectory: DNode | null = null;
  directories!: Observable<PaginationResult<DNode[]>>;

  @Output() onSelectedDirectory: EventEmitter<DNode> = new EventEmitter();

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.loadDirectories(this.rootDirectoryId);
  }

  loadDirectories(directoryId: number): void {
    const offset = 0;
    const limit = 50;
    this.directories = this.documentService.getNodesWithChildren(directoryId, offset, limit).pipe(
      map(nodesPage =>
        ({
          offset: nodesPage.offset,
          pageSize: nodesPage.pageSize,
          total: nodesPage.total,
          entries: nodesPage.entries.filter(node => this.documentService.isNodeTypeDirectory(node))
        }) as PaginationResult<DNode[]>),
      tap(() => this.documentService.getNodeWithParents(String(directoryId)).subscribe(dir => this.openedDirectory = dir))
    )
  }

  get selectedDirectoryPath() {
    if (this.selectedDirectory) {
      return this.selectedDirectory?.path
        .filter(d => d.nodeId != this.rootDirectoryId)
        .map(n => n.nodeName)
        .join(" / ") + " / " + this.documentService.getNodeName(this.selectedDirectory);
    } else {
      return "";
    }
  }

  get breadcrumbHome(): MenuItem {
    return {
      icon: 'pi pi-home',
      command: ({ item }) => {
        this.loadDirectories(this.rootDirectoryId);
      }
    };
  }

  get breadcrumb(): MenuItem[] {
    if (this.openedDirectory) {
      return this.openedDirectory.path
        .filter(dir => dir.nodeId != this.rootDirectoryId)
        .map(i => {
          return {
            label: i.nodeName,
            state: { nodeId: i.nodeId },
            command: ({ item }) => {
              this.loadDirectories(i.nodeId);
            }
          }
        }) || [];
    }

    return [];
  }

  isSelected(dir: DNode) {
    return dir.id === this.selectedDirectory?.id;
  }

  selectDirectory(directory: DNode) {
    this.selectedDirectory = directory;
    this.onSelectedDirectory.emit(directory);
  }

}
