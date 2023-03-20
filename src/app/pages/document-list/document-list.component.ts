import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { ContentModel, DNode } from 'src/app/model/node';
import { DocumentService } from 'src/app/service/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  
  nodeList$!: Observable<DNode[]>;
  
  items!: MenuItem[];

  menuItemsCreateDocument!: MenuItem[];

  pathList!: MenuItem[];

  home!: MenuItem;

  createDirectoryForm!: FormGroup;

  renameForm!: FormGroup;

  displayModalCreateDirectory: boolean = false;

  displayModalRename: boolean = false;

  selectedNode: DNode | null = null;
  
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
              this.showDialogRename(node);
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
              this.delete(node);
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

  onClickMenuCreateDocument(menuCreateDocument: any, event: any): void {

    this.menuItemsCreateDocument = [
      {
        id: "template-word",
        label: "New document",
        items: [
          {
            label: "Word document",
            icon: "pi pi-file",
            command: () => {
              this.createDocumentFromTemplate("word");
            }
          },
          {
            label: "Cell document",
            icon: "pi pi-file",
            command: () => {
              this.createDocumentFromTemplate("cell");
            }
          },
          {
            label: "Slide document",
            icon: "pi pi-file",
            command: () => {
              this.createDocumentFromTemplate("slide");
            }
          }
        ]
      }
    ];

    menuCreateDocument.toggle(event);
  }

  createDocumentFromTemplate(templateType: string): void {
    console.log("Create new document from " + templateType + " template");
    let templateName = "";

    switch (templateType) {
      case "word":
        templateName = "Document1.docx";
        break;
      case "cell":
        templateName = "calcul.xlsx";
        break;
      case "slide":
        templateName = "Diaporama1.pptx";
        break;
      default:
        break;
    }

    fetch(`/assets/file-templates/${templateName}`).then((response) => {
      response.blob().then(tpl => {
        this.documentService.uploadFile(this.currentPath, new File([tpl], `${templateName}`)).subscribe({ 
          complete: () => {
            this.loadDirectory(this.currentPath);
          }, 
          error: (error: Error) => {
            this.messageService.add({ severity: 'error', summary: 'Error while creating the document. Please try again later.', detail: error.message });
          }
        });
      });
    });
  }

  onNodeSelected(node: DNode): void {
    if (this.isNodeTypeDirectory(node)) {
      let requestedPath = ("/" + this.pathList.map(i => i.label).join('/') + "/" + this.documentService.getDocumentName(node));
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
          if (this.documentService.getDocumentName(node).endsWith('.pdf')) {
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

  onSelectedFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length > 0) {
      const selectedFile = files[0];
      this.documentService.uploadFile(this.currentPath, selectedFile).subscribe({ 
        complete: () => {
          this.loadDirectory(this.currentPath);
        }, 
        error: (error: Error) => {
          this.messageService.add({ severity: 'error', summary: 'Error while uploading the file. Please try again later.', detail: error.message });
        }
      });
    }
  }

  delete(node: DNode): void {
    this.documentService.delete(node).subscribe({ 
      complete: () => {
        this.loadDirectory(this.currentPath);
      }, 
      error: (error: Error) => {
        const nodeType = node.type == ContentModel.TYPE_DIRECTORY ? "directory" : "document";
        this.messageService.add({ severity: 'error', summary: `Error while deleting the ${nodeType}. Please try again later.`, detail: error.message });
      }
    });
  }

  showDialogRename(node: DNode): void {
    this.renameForm = new FormGroup({
      newNodeName: new FormControl(this.documentService.getDocumentName(node), Validators.required),
    });

    this.selectedNode = node;
    this.displayModalRename = true;
  }

  closeDialogRename() {
    this.displayModalRename = false;
    this.selectedNode = null;
  }

  rename(): void {
    if (this.selectedNode) {
      const newName = this.renameForm.get("newNodeName")?.value;
      const updateNodeData = { ...this.selectedNode };
      updateNodeData.properties = [
        {
          key: "cm:name",
          value: newName
        }
      ]
      this.documentService.update(updateNodeData).subscribe({ 
        complete: () => {
          this.loadDirectory(this.currentPath);
          this.closeDialogRename();
        }, 
        error: (error: Error) => {
          const nodeType = updateNodeData.type == ContentModel.TYPE_DIRECTORY ? "directory" : "document";
          this.messageService.add({ severity: 'error', summary: `Error while updating the ${nodeType}. Please try again later.`, detail: error.message });
        }
      });
    }
    
  }

}
