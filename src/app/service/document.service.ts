import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DNode } from 'src/app/model/node';
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

}
