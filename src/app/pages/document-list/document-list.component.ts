import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
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
  
  items!: MenuItem[];

  pathList!: MenuItem[];

  home!: MenuItem;

  createDirectoryForm!: FormGroup;

  displayModalCreateDirectory: boolean = false;
  
  @Input()
  currentPath: string = "/";
  
  constructor(private messageService: MessageService, private documentService: DocumentService) { }
  
  ngOnInit(): void {
    this.loadDirectory("/");
  }

  loadDirectory(path: string) {
    this.currentPath = path;
    this.nodeList$ = this.documentService.getNodesForPath(this.currentPath);
    this.reloadBreadcrumb(this.currentPath);
  }

  reloadBreadcrumb(segment: string): void {
    let path = this.currentPath.substring(0, this.currentPath.indexOf(segment) + segment.length);
  
    this.currentPath = path;
    this.nodeList$ = this.documentService.getNodesForPath(this.currentPath);

    this.pathList = this.currentPath.split("/").map(i => (
      {
        label: i,
        command: ({ item }) => {
          this.reloadBreadcrumb(i);
        }
      }
    ));

    this.pathList.shift();
    this.home = {icon: 'pi pi-home', command: ({ item }) => {
      this.reloadBreadcrumb("/");
    }};
  }

  onClickMenu(menu: any, event: any, node: DNode): void {
    this.items = [
      {
        id: "common",
        label: `${this.isNodeTypeContent(node) ? "Document" : "Directory"} actions`,
        items: [
          {
            label: 'Rename',
            icon: 'pi pi-refresh',
            command: () => {
              console.log("rename")
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
              console.log("delete")
            }
          }
        ]
      }
    ];

    if (this.isNodeTypeContent(node)) {
      this.items = this.items.map(i => {
        if (i.id === "common") {
          i.items?.push(
            {
              label: 'Open in OnlyOffice',
              icon: 'pi pi-file-edit',
              command: () => {
                this.edit(node);
              }
            }
          )
        }
        return i;
      });
    }

    menu.toggle(event);
  }

  onNodeSelected(node: DNode): void {
    if (this.isNodeTypeDirectory(node)) {
      let requestedPath = ("/" + this.pathList.map(i => i.label).join('/') + "/" + node.properties['cm:name']);
      if (requestedPath.startsWith("//")) {
        requestedPath = requestedPath.slice(1);
      }

      this.loadDirectory(requestedPath);
    }
  }

  getIcon(node: DNode): string {
    if (this.isNodeTypeContent(node)) {
      switch(this.documentService.getOnlyOfficeDocumentType(node)) {
        case "word":
          if (node.properties['cm:name'].endsWith('.pdf')) {
            return "/assets/img/office/pdf-icon.svg";
          } else {
            return "/assets/img/office/word-icon.svg";
          }
        case "cell":
          return "/assets/img/office/excel-icon.svg";
        case "slide":
          return "/assets/img/office/powerpoint-icon.svg";
        default:
          // unknown content type document
          return "/assets/img/unknown_file-icon.svg";
      }
    } else if (this.isNodeTypeDirectory(node)) {
      return "/assets/img/directory_closed-icon.svg";
    }

    // if not content type and not directory
    return "/assets/img/unknown_file-icon.svg";
  }

  edit(node: DNode): void {
    localStorage.setItem("onlyoffice_opened_node", JSON.stringify(node));
    window.open(`${window.location.origin}/edit/${node.uuid}`, '_blank', 'noreferrer');
  }

  isOnlyOfficeSupported(node: DNode): boolean {
    return this.documentService.isSupportedByOnlyOffice(node);
  }

  isNodeTypeContent(node: DNode): boolean {
    return this.documentService.isNodeTypeContent(node);
  }

  isNodeTypeDirectory(node: DNode): boolean {
    return this.documentService.isNodeTypeDirectory(node);
  }

  showDialogCreateDirectory(): void {
    this.createDirectoryForm = new FormGroup({
      newDirectoryName: new FormControl("", Validators.required),
    });

    this.displayModalCreateDirectory = true;
  }

  createDirectory(): void {
    const newDirectoryName = this.createDirectoryForm.get('newDirectoryName')?.value

    this.documentService.createDirectory(this.currentPath, newDirectoryName).subscribe({ 
      complete: () => {
        this.displayModalCreateDirectory = false;
        this.createDirectoryForm.reset();
        this.loadDirectory(this.currentPath);
      }, 
      error: (error: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error while creating the directory. Please try again later.', detail: error.message });
      }
    });
  }

  showDialogUploadFile(): void {
    console.log("Upload File")
  }

}
