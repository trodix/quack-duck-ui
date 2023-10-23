import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {PermissionOnResource} from "../model/PermissionOnResource";

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

  addPolicy(policy: PermissionOnResource): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/admin/security/add-policy`, policy);
  }

  addRoleForUser(user: string, role: string): Observable<void> {
    return this.http.post<void>(`${environment.BACKEND_BASE_URL}/admin/security/add-role-for-user`, { user, role });
  }

}
