import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExtendedPermission, Policy } from 'src/app/model/Policy';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodePermissionService {

  constructor(private http: HttpClient) { }

  getPermissionOnNode(nodeId: string): Observable<ExtendedPermission[]> {
    return this.http.get<ExtendedPermission[]>(`${environment.BACKEND_BASE_URL}/nodes/${nodeId}/permissions`);
  }

  getPermissionOnNodeForUser(nodeId: string): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${environment.BACKEND_BASE_URL}/nodes/${nodeId}/user-permissions`);
  }

  getSubjects(nodeId: string, action: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.BACKEND_BASE_URL}/nodes/${nodeId}/not-authorized-subjects/${action}`);
  }

  getPermitedActionsOnNode(nodeId: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.BACKEND_BASE_URL}/nodes/${nodeId}/permitted-actions`);
  }

  addPermission(nodeId: string, sub: string, obj: string, act: string): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/nodes/permissions`, [{sub: sub, obj: obj, act: act}]);
  }

  removePermission(nodeId: string, authz: ExtendedPermission): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/nodes/remove-permissions`, [authz.policy]);
  }

}
