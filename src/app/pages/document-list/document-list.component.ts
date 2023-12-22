import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {ContentModel, DNode} from 'src/app/model/node';
import {DocumentService} from 'src/app/service/document.service';
import {DomSanitizer} from "@angular/platform-browser";
import {PaginationResult} from "../../model/pagination/pagination-result";
import {Image} from "primeng/image";
import {DomHandler} from "primeng/dom";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  readonly ROOT_NODE: number = 1;

  nodeList: PaginationResult<DNode[]> | null = null;

  pageSize: number = 50;

  items!: MenuItem[];

  menuItemsCreateDocument!: MenuItem[];

  pathList!: MenuItem[];

  home!: MenuItem;

  createDirectoryForm!: FormGroup;

  renameForm!: FormGroup;

  displayModalCreateDirectory: boolean = false;

  displayModalDelete: boolean = false;

  displayModalRename: boolean = false;

  displayModalMove: boolean = false;

  displayModalAuthorization: boolean = false;

  currentNode!: DNode;

  editingNode: DNode | null = null;

  previewingNode: DNode | null = null;

  previewingContentUrl: string = "";

  @ViewChild('previewImg') previewImgRef!: Image;

  moveDestination: DNode | null = null;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const currentPathNodeId = params['nodeId'] || this.ROOT_NODE;
      this.loadDirectory(currentPathNodeId, 0, this.pageSize);
    });
  }

  loadDirectory(directoryId: number, offset= 0, pageSize = 10) {
    this.documentService.getNodeWithParents(directoryId.toString()).subscribe(node => {
      this.currentNode = { ...node, path: node.path.filter(p => p.nodeId != this.ROOT_NODE) };
      this.documentService.getNodesWithChildren(directoryId, offset, pageSize).subscribe(data => {
        this.nodeList = data;
      });
      this.createBreadcrumb();
    });
  }

  handlePagination($event: {page: number, first: number, rows: number, pageCount: number}) {
    this.pageSize = $event.rows;
    this.loadDirectory(this.currentNode.id, $event.page * $event.rows, $event.rows)
  }

  openDirectory(nodeId: number): void {
    this.router.navigate(['/'], { queryParams: { nodeId: nodeId }, queryParamsHandling: 'merge' });
  }

  openPreviewFile(node: DNode) {

    if (this.isOnlyOfficeSupported(node)) {
      this.documentService.edit(node);
    }
    else {
      this.previewingNode = node;
      this.documentService.getFileByNodeId(String(this.previewingNode?.id)).subscribe(data => {
        const objectURL = URL.createObjectURL(data);
        this.previewingContentUrl = objectURL;
        console.log(this.previewImgRef)
      });
    }

  }

  closePreviewFile() {
    this.previewingNode = null;
    this.previewingContentUrl = "";
  }

  refreshDocumentList() {
    this.loadDirectory(this.currentNode.id);
  }

  createBreadcrumb(): void {
      this.pathList = this.currentNode.path.map(i => {
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
            icon: 'pi pi-trash',
            command: () => {
              this.showDialogDelete(node);
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
            },
            {
              label: 'Download',
              icon: 'pi pi-download',
              command: () => {
                this.download(node);
              }
            },
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
        this.documentService.uploadFile(this.currentNode.id, new File([tpl], `${templateName}`)).subscribe({
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
    } else {
      console.log("Selected node " + JSON.stringify(node));
    }
  }

  onNodeDoubleClicked(node: DNode): void {
    if (!this.isNodeTypeDirectory(node)) {
      this.openPreviewFile(node);
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

  isMoveFormValid() {
    return this.moveDestination && this.editingNode?.id != this.moveDestination?.id && this.moveDestination?.id != this.editingNode?.parentId;
  }

  moveNodeToDir() {
    if (this.isMoveFormValid()) {
      this.documentService.moveNode(this.editingNode!, this.moveDestination!.id).subscribe({
        complete: () => {
          const nodeType = this.editingNode!.type == ContentModel.TYPE_DIRECTORY ? "Directory" : "Document";
          this.messageService.add({ severity: 'success', summary: `${nodeType} ${this.documentService.getNodeName(this.editingNode!)} moved with success`});
          this.moveDestination = null;
          this.closeDialogMove();
          this.refreshDocumentList();
        },
        error: (error: Error) => {
          const nodeType = this.editingNode!.type == ContentModel.TYPE_DIRECTORY ? "Directory" : "Document";
          this.messageService.add({ severity: 'error', summary: `Error while moving the ${nodeType} ${this.documentService.getNodeName(this.editingNode!)}. Please try again later.`, detail: error.message });
        }
      });
    }
  }

  createDirectory(): void {
    const newDirectoryName = this.createDirectoryForm.get('newDirectoryName')?.value

    this.documentService.createDirectory(this.currentNode.id, newDirectoryName).subscribe({
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
    if (this.currentNode && files.length > 0) {
      const selectedFile = files[0];
      this.documentService.uploadFile(this.currentNode.id, selectedFile).subscribe({
        complete: () => {
          this.refreshDocumentList();
        },
        error: (error: Error) => {
          this.messageService.add({ severity: 'error', summary: 'Error while uploading the file. Please try again later.', detail: error.message });
        }
      });
    }
  }

  delete(): void {
    this.documentService.delete(this.editingNode!).subscribe({
      complete: () => {
        this.refreshDocumentList();
        this.closeDialogDelete();
      },
      error: (error: Error) => {
        const nodeType = this.editingNode?.type == ContentModel.TYPE_DIRECTORY ? "directory" : "document";
        this.messageService.add({ severity: 'error', summary: `Error while deleting the ${nodeType}. Please try again later.`, detail: error.message });
      }
    });
  }

  showDialogDelete(node: DNode): void {

    this.editingNode = node;
    this.displayModalDelete = true;
  }

  closeDialogDelete() {
    this.displayModalDelete = false;
    this.editingNode = null;
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

  download(node: DNode) {
    if (this.documentService.isNodeTypeContent(node)) {
      console.log("Downloading document " + this.documentService.getNodeName(node));
      this.documentService.getFileByNodeId(String(node.id)).subscribe(blob => {
        console.log("Downloaded " + blob.size + " bytes");

        const anchor = document.createElement('a');
        anchor.download = this.documentService.getNodeName(node);
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.click();
      });
    }
  }

}
