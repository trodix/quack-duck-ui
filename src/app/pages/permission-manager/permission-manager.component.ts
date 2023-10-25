import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {forkJoin, map, Observable} from "rxjs";
import {PermissionService, User} from "../../service/permission.service";
import {MessageService} from "primeng/api";
import {GroupingPolicy, Policy} from "../../model/Policy";

interface DropDownItem { label: string, value: string }

@Component({
  selector: 'app-permission-manager',
  templateUrl: './permission-manager.component.html',
  styleUrls: ['./permission-manager.component.scss']
})
export class PermissionManagerComponent implements OnInit {

  users$: Observable<DropDownItem[]> = new Observable();
  // roles$: Observable<DropDownItem[]> = new Observable();
  obj$: Observable<DropDownItem[]> = new Observable();
  actions$: Observable<DropDownItem[]> = new Observable();
  usersAndRoles$: Observable<DropDownItem[]> = new Observable();
  policies$: Observable<Policy[]> = new Observable();
  groupingPolicies$: Observable<GroupingPolicy[]> = new Observable();
  permissionsForUser$: Observable<Policy[]> = new Observable();

  selectedUser: string | null = null;

  assignPermissionFormGroup = new FormGroup({
    selectedUser: new FormControl('', Validators.required),
    selectedRole: new FormControl('', Validators.required),
  });

  createPermissionFormGroup = new FormGroup({
    subjectTxt: new FormControl(''),
    subject: new FormControl(''),
    selectedObj: new FormControl('', Validators.required),
    selectedAction: new FormControl('', Validators.required),
  });

  constructor(private readonly permissionService: PermissionService, private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.users$ = this.permissionService.getAllUsers().pipe(
      map((data: User[]) => data.map(item => ({ label: item.username, value: item.id })))
    )
    // this.roles$ = this.permissionService.getAllRoles().pipe(
    //   map((data: string[]) => data.map(item => ({ label: item, value: item })))
    // )
    this.obj$ = this.permissionService.getAllObjects().pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
    this.actions$ = this.permissionService.getAllActions().pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
    this.groupingPolicies$ = this.permissionService.getGroupingPolicies();
    this.usersAndRoles$ = forkJoin(this.users$, this.groupingPolicies$).pipe(
      map(
        ([a, b]) =>
          a.concat(
            Array.from(
              new Set(b.map(i => i.group))
            ).map(
              gp => ({ label: gp, value: gp})
            )
          )
      )
    );
    this.policies$ = this.permissionService.getAllPermissions();
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
    const subjectTxt = this.createPermissionFormGroup.get("subjectTxt")?.value as any as string;
    const subject = this.createPermissionFormGroup.get("subject")?.value as any as DropDownItem;
    const selectedObj: DropDownItem = this.createPermissionFormGroup.get('selectedObj')?.value as any as DropDownItem;
    const selectedAction: DropDownItem = this.createPermissionFormGroup.get('selectedAction')?.value as any as DropDownItem;

    const subValue = !subjectTxt ? subject.value : subjectTxt;

    if ((!subValue) || !selectedObj || !selectedAction) {
      this.messageService.add({ severity: 'error', summary: `Unable to grant permission ${selectedAction.label} to ${subValue} on resource ${selectedObj.label}. Please try again later.`, detail: "All values must be filled" });
      return;
    }

    this.permissionService.addPolicy({
      sub: subValue,
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

  removePolicy(policy: Policy): void {
    this.permissionService.removePolicy(policy).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: `Permission ${policy.act} removed to ${policy.sub} on resource ${policy.obj}.`});
          this.policies$ = this.policies$.pipe(
            map((data: Policy[]) => [...data.filter(i => !(i.sub === policy.sub && i.obj === policy.obj && i.act === policy.act))])
          );
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: `Unable to remove permission ${policy.act} to ${policy.sub} on resource ${policy.obj}. Please try again later.`, detail: error.message });
        }
      }
    );
  }

  removePermissionForUser(authz: Policy): void {
    if (!this.selectedUser) {
      return;
    }
    this.permissionService.removePermissionForUser(this.selectedUser, authz).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: `Permission ${authz.act} removed to ${authz.sub} on resource ${authz.obj}.`});
          this.policies$ = this.policies$.pipe(
            map((data: Policy[]) => [...data.filter(i => !(i.sub === authz.sub && i.obj === authz.obj && i.act === authz.act))])
          );
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: `Unable to remove permission ${authz.act} to ${authz.sub} on resource ${authz.obj}. Please try again later.`, detail: error.message });
        }
      }
    );
  }

  onSelectedUserOrRole(event: any) {
    const selectedUserOrRole = (event.value as DropDownItem).value;
    this.selectedUser = selectedUserOrRole;
    this.permissionsForUser$ = this.permissionService.getImplicitPermissionsForUser(this.selectedUser);
  }

}
