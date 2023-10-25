import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ExtendedPermission, GroupingPolicy, Policy} from "../model/Policy";

export interface User { id: string, username: string };

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<User[]>(`${environment.BACKEND_BASE_URL}/admin/security/users`);
  }

  getAllSubjects(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.BACKEND_BASE_URL}/admin/security/subjects`);
  }

  getAllObjects(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.BACKEND_BASE_URL}/admin/security/objects`);
  }

  getAllActions(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.BACKEND_BASE_URL}/admin/security/actions`);
  }

  addPolicy(policy: Policy): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/admin/security/add-policy`, policy);
  }

  addRoleForUser(user: string, role: string): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/admin/security/add-role-for-user`, { user, role });
  }

  getAllPermissions(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${environment.BACKEND_BASE_URL}/admin/security/permissions`);
  }

  removePolicy(authz: Policy): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/admin/security/remove-policy`, authz);
  }

  getImplicitPermissionsForUser(user: string): Observable<Policy[]> {
    return this.http.post<Policy[]>(`${environment.BACKEND_BASE_URL}/admin/security/permissions-for-user`, user);
  }

  getAllRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.BACKEND_BASE_URL}/admin/security/roles`);
  }

  removePermissionForUser(user: string, authz: Policy): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/admin/security/remove-policy`, {user, authz});
  }

  getGroupingPolicies(): Observable<GroupingPolicy[]> {
    return this.http.get<GroupingPolicy[]>(`${environment.BACKEND_BASE_URL}/admin/security/grouping-policy`);
  }

}
