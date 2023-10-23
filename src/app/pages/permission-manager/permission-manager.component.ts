import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {forkJoin, map, merge, Observable} from "rxjs";
import {PermissionService, User} from "../../service/permission.service";
import {MessageService} from "primeng/api";

interface DropDownItem { label: string, value: string }

@Component({
  selector: 'app-permission-manager',
  templateUrl: './permission-manager.component.html',
  styleUrls: ['./permission-manager.component.scss']
})
export class PermissionManagerComponent implements OnInit {

  users$: Observable<DropDownItem[]> = new Observable();
  subjects$: Observable<DropDownItem[]> = new Observable();
  obj$: Observable<DropDownItem[]> = new Observable();
  actions$: Observable<DropDownItem[]> = new Observable();
  usersAndRoles$: Observable<DropDownItem[]> = new Observable();

  assignPermissionFormGroup = new FormGroup({
    selectedUser: new FormControl('', Validators.required),
    selectedRole: new FormControl('', Validators.required),
  });

  createPermissionFormGroup = new FormGroup({
    subject: new FormControl('', Validators.required),
    selectedObj: new FormControl('', Validators.required),
    selectedAction: new FormControl('', Validators.required),
  });

  constructor(private readonly permissionService: PermissionService, private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.users$ = this.permissionService.getAllUsers().pipe(
      map((data: User[]) => data.map(item => ({ label: item.username, value: item.id })))
    )
    this.subjects$ = this.permissionService.getAllSubjects().pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
    this.obj$ = this.permissionService.getAllObjects().pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
    this.actions$ = this.permissionService.getAllActions().pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
    this.usersAndRoles$ = forkJoin(this.users$, this.subjects$).pipe(
      map(([a, b]) => a.concat(b))
    );
  }

  assignRole(): void {
    const user: DropDownItem = this.assignPermissionFormGroup.get('selectedUser')?.value as any as DropDownItem;
    const role: DropDownItem = this.assignPermissionFormGroup.get('selectedRole')?.value as any as DropDownItem;

    this.permissionService.addRoleForUser(user.value, role.value).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: `Subject ${user.label} assigned to ${role.label}.`});
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: `Unable to assigned ${user.label} to ${role.label}. Please try again later.`, detail: error.message });
        },
        next: () => {
          this.assignPermissionFormGroup.reset();
        }
      }
    );
  }

  addPolicy(): void {
    const subject = this.createPermissionFormGroup.get("subject")?.value as any as DropDownItem;
    const selectedObj: DropDownItem = this.createPermissionFormGroup.get('selectedObj')?.value as any as DropDownItem;
    const selectedAction: DropDownItem = this.createPermissionFormGroup.get('selectedAction')?.value as any as DropDownItem;

    this.permissionService.addPolicy({
      sub: subject.value,
      obj: selectedObj.value,
      act: selectedAction.value,
    }).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: `Permission ${selectedAction.label} granted to ${subject} on resource ${selectedObj.label}.`});
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: `Unable to grant permission ${selectedAction.label} to ${subject} on resource ${selectedObj.label}. Please try again later.`, detail: error.message });
        },
        next: () => {
          this.createPermissionFormGroup.reset();
        }
      }
    );
  }

}
