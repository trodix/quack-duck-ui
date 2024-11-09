import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IConfig} from '@onlyoffice/document-editor-angular';
import {Observable, Subject} from 'rxjs';
import {ContentModel, CreateNode, DNode, Property} from 'src/app/model/node';
import {environment} from 'src/environments/environment';
import {PaginationResult} from "../model/pagination/pagination-result";
import {TreeNode} from "primeng/api";
import {ContentVersion} from "../model/content-version";


export interface SearchQuery {
  term: string;
  value: string;
}

export interface SearchResult {
  resultCount: number;
  items: SearchResultEntry[];
}

export interface SearchResultEntry {
  dbId: number;
  type: string;
  path: string;
  tags: string[];
  properties: Property[];
  filecontent: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  onSelectedNodeFromSideBar: Subject<DNode> = new Subject<DNode>();

  constructor(private http: HttpClient) { }

  edit(node: DNode): void {
    localStorage.setItem("onlyoffice_opened_node", JSON.stringify(node));
    window.open(`${window.location.origin}/edit/${node.id}`, '_blank', 'noreferrer');
  }

  moveNode(node: DNode, destinationId: number) {
    return this.http.put<DNode>(`${environment.BACKEND_BASE_URL}/nodes/${node.id}/move`, { destinationId: destinationId });
  }

  getNodesWithChildren(parentId: number | null, offset: number, limit: number): Observable<PaginationResult<DNode[]>> {
    return this.http.get<PaginationResult<DNode[]>>(`${environment.BACKEND_BASE_URL}/nodes/${parentId}/children`,
      {params: {offset: offset, limit: limit}}
    )
  }

  getNodeWithParents(nodeId: string | null): Observable<DNode> {
    return this.http.get<DNode>(`${environment.BACKEND_BASE_URL}/nodes/${nodeId}`);
  }

  getFileByNodeId(nodeId: string): Observable<Blob> {
    // @ts-ignore
    return this.http.get<Blob>(`${environment.BACKEND_BASE_URL}/storage/nodes/${nodeId}/content`, { responseType: 'blob' })
  }

  getNodeName(node: DNode): string {
    return node.properties.find(prop => prop.key === "cm:name")?.value || "";
  }

  getOnlyOfficeDocumentType(node: DNode): string {

    const fileExt = "." + this.getNodeName(node).split(".").reverse()[0].toLowerCase();

    const extListWord = [
      ".doc", ".docm", ".docx", ".docxf", ".dot", ".dotm", ".dotx",
      ".epub", ".fodt", ".fb2", ".htm", ".html", ".mht", ".odt", ".oform", ".ott", ".oxps",
      ".pdf", ".rtf", ".txt", ".djvu", ".xml", ".xps"
    ];

    const extListCell = [
      ".csv", ".fods", ".ods", ".ots", ".xls", ".xlsb", ".xlsm", ".xlsx", ".xlt", ".xltm", ".xltx"
    ];

    const extListSlide = [
      ".fodp", ".odp", ".otp", ".pot", ".potm", ".potx", ".pps", ".ppsm", ".ppsx", ".ppt", ".pptm", ".pptx"
    ];

    if (extListWord.includes(fileExt)) {
      return "word";
    } else if (extListCell.includes(fileExt)) {
      return "cell";
    } else if (extListSlide.includes(fileExt)) {
      return "slide";
    }

    return "";
  }

  getIcon(node: DNode): string {
    if (this.isNodeTypeContent(node)) {
      switch (this.getOnlyOfficeDocumentType(node)) {
        case "word":
          if (this.getNodeName(node).endsWith('.pdf')) {
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

  getOnlyOfficeFileType(node: DNode): string {
    return this.getNodeName(node).split(".").reverse()[0].toLowerCase();
  }

  isSupportedByOnlyOffice(node: DNode): boolean {
    return this.getOnlyOfficeDocumentType(node) != "";
  }

  isNodeTypeContent(node: DNode): boolean {
    return node.type === ContentModel.TYPE_CONTENT;
  }

  isNodeTypeDirectory(node: DNode): boolean {
    return node.type === ContentModel.TYPE_DIRECTORY;
  }

  createDirectory(parentId: number, name: string): Observable<DNode> {

    const node: CreateNode = {
      parentId: parentId,
      type: ContentModel.TYPE_DIRECTORY,
      tags: [],
      properties: [
        {
          key: "cm:name",
          value: name
        }
      ]
    }

    return this.http.post<DNode>(`${environment.BACKEND_BASE_URL}/nodes`, node);
  }

  uploadFile(parentId: number | null, file: File): Observable<DNode> {

    const formData = new FormData();
    formData.set("type", ContentModel.TYPE_CONTENT);
    formData.set("file", file);
    //formData.set("type", file.type);
    formData.set("parentId", String(parentId));
    formData.set("properties['cm:name']", file.name);

    return this.http.post<DNode>(`${environment.BACKEND_BASE_URL}/storage/nodes`, formData);
  }

  delete(node: DNode): Observable<any> {
    return this.http.delete(`${environment.BACKEND_BASE_URL}/nodes/${node.id}`);
  }

  update(node: DNode): Observable<DNode> {
    return this.http.put<DNode>(`${environment.BACKEND_BASE_URL}/nodes/${node.id}`, node);
  }

  getOnlyOfficeEditorConfig(node: DNode): Observable<IConfig> {
    return this.http.post<IConfig>(`${environment.BACKEND_BASE_URL}/integration/onlyoffice/open-document-request/${node.id}`, null);
  }

  getProperty(node: DNode, prop: string): string | null {
    node.properties.forEach((property, key) => {
      console.log(`properties['${key}']`, property.value);
    });

    for (let key in node.properties) {
      if (prop == key) {
        return node.properties[prop];
      }
    }
    return null;
  }

  getVersionsForNode(node: DNode): Observable<ContentVersion[]> {
    return this.http.get<ContentVersion[]>(`${environment.BACKEND_BASE_URL}/storage/nodes/${node.id}/versions`);
  }

  restoreContentVersion(node: DNode, contentVersion: number): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/storage/nodes/${node.id}/versions/${contentVersion}`, {});
  }

  search(query: SearchQuery): Observable<SearchResult> {
    return this.http.post<SearchResult>(`${environment.BACKEND_BASE_URL}/search`, query, {params: { limit: 10 }});
  }

  getDirectoryTree(nodeId: number): Observable<DNode[]> {
    return this.http.get<DNode[]>(`${environment.BACKEND_BASE_URL}/nodes/tree/${nodeId}`, {params: { nodeLevel: 0 }});
  }

  buildTreeComponentData(data: DNode[]): TreeNode[] {
    return data.map(node => ({
      label: this.getNodeName(node),
      data: node,
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder",
      children: this.buildTreeComponentData(node.children.filter(c => c.type === ContentModel.TYPE_DIRECTORY))
    }));
  }

}
