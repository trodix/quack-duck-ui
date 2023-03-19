import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentModel, DNode, DNodeDirRequest } from 'src/app/model/node';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  getNodesForPath(path: string): Observable<DNode[]> {
    return this.http.get<DNode[]>(`${environment.BACKEND_BASE_URL}/node?path=${path}`);
  }

  getFileByNodeId(nodeId: string): Observable<Blob> {
    return this.http.get<Blob>(`${environment.BACKEND_BASE_URL}/node/${nodeId}/content`);
  }

  getDocumentName(node: DNode): string {
    return node.properties["cm:name"];
  }

  getOnlyOfficeDocumentType(node: DNode): string {

    const fileExt = "." + this.getDocumentName(node).split(".").reverse()[0].toLowerCase();

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

  getOnlyOfficeFileType(node: DNode): string {
    return this.getDocumentName(node).split(".").reverse()[0].toLowerCase();
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

  createDirectory(path: string, name: string): Observable<DNode> {

    const formData = new FormData();
    formData.set("directoryPath", path);
    formData.set("properties['cm:name']", name);
    
    return this.http.post<DNode>(`${environment.BACKEND_BASE_URL}/directory`, formData);
  }

  uploadFile(path: string, file: File): Observable<DNode> {

    const formData = new FormData();
    formData.set("file", file);
    formData.set("type", file.type);
    formData.set("directoryPath", path);
    formData.set("properties['cm:name']", file.name);

    return this.http.post<DNode>(`${environment.BACKEND_BASE_URL}/upload`, formData);
  }

  delete(node: DNode): Observable<any> {
    return this.http.delete(`${environment.BACKEND_BASE_URL}/node/${node.uuid}`);
  }

}
