import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ContentModel, DNode } from 'src/app/model/node';
import { DocumentService } from 'src/app/service/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  readonly ROOT_NODE: number = 1;

  nodeList$!: Observable<DNode[]>;

  items!: MenuItem[];

  menuItemsCreateDocument!: MenuItem[];

  pathList!: MenuItem[];

  home!: MenuItem;

  createDirectoryForm!: FormGroup;

  renameForm!: FormGroup;

  displayModalCreateDirectory: boolean = false;

  displayModalRename: boolean = false;

  displayModalMove: boolean = false;

  displayModalAuthorization: boolean = false;

  selectedNode!: DNode;

  editingNode: DNode | null = null;


  constructor(private messageService: MessageService, private route: ActivatedRoute, private router: Router, private documentService: DocumentService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const currentPathNodeId = params['nodeId'] || this.ROOT_NODE;
      this.loadDirectory(currentPathNodeId);
    });
  }

  loadDirectory(directoryId: number) {
    this.documentService.getNodeWithParents(directoryId.toString()).subscribe(node => {
      this.selectedNode = { ...node, path: node.path.filter(p => p.nodeId != this.ROOT_NODE) };
      this.nodeList$ = this.documentService.getNodesWithChildren(directoryId);
      this.createBreadcrumb();
    });
  }

  openDirectory(nodeId: number): void {
    this.router.navigate(['/'], { queryParams: { nodeId: nodeId }, queryParamsHandling: 'merge' });
  }

  refreshDocumentList() {
    this.loadDirectory(this.selectedNode.id);
  }

  createBreadcrumb(): void {
      this.pathList = this.selectedNode.path.map(i => {
        return {
          label: i.nodeName,
          command: ({ item }) => {
            this.openDirectory(i.nodeId);
          }
        }
      });

      this.home = {
        icon: 'pi pi-home',
        command: ({ item }) => {
          this.openDirectory(this.ROOT_NODE);
        }
      };
  }

  onClickMenu(menu: any, event: any, node: DNode): void {
    this.items = [
      {
        id: "common",
        label: `${this.isNodeTypeContent(node) ? "Document" : "Directory"} actions`,
        items: [
          {
            label: 'Move',
            icon: 'pi pi-reply',
            command: () => {
              this.showDialogMove(node);
            }
          },
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
          },
          {
            label: 'Manage permissions',
            icon: 'pi pi-user',
            command: () => {
              this.showDialogAuthorization(node);
            }
          },
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
                this.documentService.edit(node);
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
        this.documentService.uploadFile(this.selectedNode.id, new File([tpl], `${templateName}`)).subscribe({
          complete: () => {
            this.refreshDocumentList();
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
      this.openDirectory(node.id);
    }
  }

  getIcon(node: DNode): string {
    if (this.isNodeTypeContent(node)) {
      switch (this.documentService.getOnlyOfficeDocumentType(node)) {
        case "word":
          if (this.documentService.getNodeName(node).endsWith('.pdf')) {
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

    this.documentService.createDirectory(this.selectedNode.id, newDirectoryName).subscribe({
      complete: () => {
        this.displayModalCreateDirectory = false;
        this.createDirectoryForm.reset();
        this.refreshDocumentList();
      },
      error: (error: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error while creating the directory. Please try again later.', detail: error.message });
      }
    });
  }

  onSelectedFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (this.selectedNode && files.length > 0) {
      const selectedFile = files[0];
      this.documentService.uploadFile(this.selectedNode.id, selectedFile).subscribe({
        complete: () => {
          this.refreshDocumentList();
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
        this.refreshDocumentList();
      },
      error: (error: Error) => {
        const nodeType = node.type == ContentModel.TYPE_DIRECTORY ? "directory" : "document";
        this.messageService.add({ severity: 'error', summary: `Error while deleting the ${nodeType}. Please try again later.`, detail: error.message });
      }
    });
  }

  showDialogMove(node: DNode): void {

    this.editingNode = node;
    this.displayModalMove = true;
  }

  showDialogAuthorization(node: DNode): void {

    this.editingNode = node;
    this.displayModalAuthorization = true;
  }

  closeDialogAuthorization() {
    this.displayModalAuthorization = false;
    this.editingNode = null;
  }

  closeDialogMove() {
    this.displayModalMove = false;
    this.editingNode = null;
  }

  showDialogRename(node: DNode): void {
    this.renameForm = new FormGroup({
      newNodeName: new FormControl(this.documentService.getNodeName(node), Validators.required),
    });

    this.editingNode = node;
    this.displayModalRename = true;
  }

  closeDialogRename() {
    this.displayModalRename = false;
    this.editingNode = null;
  }

  rename(): void {
    if (this.editingNode) {
      const newName = this.renameForm.get("newNodeName")?.value;
      const updateNodeData = { ...this.editingNode };
      updateNodeData.properties = [
        {
          key: "cm:name",
          value: newName
        }
      ]
      this.documentService.update(updateNodeData).subscribe({
        complete: () => {
          this.closeDialogRename();
          this.refreshDocumentList();
        },
        error: (error: Error) => {
          const nodeType = updateNodeData.type == ContentModel.TYPE_DIRECTORY ? "directory" : "document";
          this.messageService.add({ severity: 'error', summary: `Error while updating the ${nodeType}. Please try again later.`, detail: error.message });
        }
      });
    }

  }

}
