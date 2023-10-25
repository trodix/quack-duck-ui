import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { ExtendedPermission, Policy } from 'src/app/model/Policy';
import { DNode } from 'src/app/model/node';
import { NodePermissionService } from 'src/app/service/node-permission.service';

interface DropDownItem { label: string, value: string }

@Component({
  selector: 'app-node-permission-manager',
  templateUrl: './node-permission-manager.component.html',
  styleUrls: ['./node-permission-manager.component.scss']
})
export class NodePermissionManagerComponent implements OnInit {

  @Input() editingNode!: DNode;
  obj!: string;

  permissions$: Observable<ExtendedPermission[]> = new Observable();
  subjects$: Observable<DropDownItem[]> = new Observable();
  actions$: Observable<DropDownItem[]> = new Observable();

  permissionFormGroup = new FormGroup({
    selectedSubject: new FormControl('', Validators.required),
    selectedAction: new FormControl('', Validators.required),
  });

  constructor(private readonly nodePermissionService: NodePermissionService, private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.obj = "feature:node:" + this.editingNode.id;
    this.permissions$ = this.nodePermissionService.getPermissionOnNode(this.editingNode.id.toString());

    this.actions$ = this.nodePermissionService.getPermitedActionsOnNode(this.editingNode.id.toString()).pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
  }

  addPermission(): void {
    const selectedSubject: DropDownItem = this.permissionFormGroup.get('selectedSubject')?.value as any as DropDownItem;
    const selectedAction: DropDownItem = this.permissionFormGroup.get('selectedAction')?.value as any as DropDownItem;

    this.nodePermissionService.addPermission(this.editingNode.id.toString(), selectedSubject.value, this.obj, selectedAction.value).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: `Permission ${selectedAction.value} granted to ${selectedSubject.value} on resource ${this.obj}.`});
          this.permissions$ = this.permissions$.pipe(
            map((data: ExtendedPermission[]) => [...data, { policy: { sub: selectedSubject.value, obj: this.obj, act: selectedAction.value }, hasPermission: true }])
          );
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: `Unable to grant permission ${selectedAction.value} to ${selectedSubject.value} on resource ${this.obj}. Please try again later.`, detail: error.message });
        }
      }
    );
  }

  removePermission(authz: ExtendedPermission): void {

    this.nodePermissionService.removePermission(this.editingNode.id.toString(), authz).subscribe({
        complete: () => {
          this.messageService.add({ severity: 'success', summary: `Permission ${authz.policy.act} removed to ${authz.policy.sub} on resource ${authz.policy.obj}.`});
          this.permissions$ = this.permissions$.pipe(
            map((data: ExtendedPermission[]) => [...data.filter(i => !(i.policy.sub === authz.policy.sub && i.policy.obj === authz.policy.obj && i.policy.act === authz.policy.act))])
          );
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: `Unable de remove permission ${authz.policy.act} to ${authz.policy.sub} on resource ${authz.policy.obj}. Please try again later.`, detail: error.message });
        }
      }
    );
  }

  onSelectedAction(event: any) {

    const selectedAction = (event.value as DropDownItem).value;

    this.subjects$ = this.nodePermissionService.getSubjects(this.editingNode.id.toString(), selectedAction).pipe(
      map((data: string[]) => data.map(item => ({ label: item, value: item })))
    )
  }

  // checkPermissionExists(permission: PermissionOnResource): Subject<boolean>  {
  //   let a = new Subject<boolean>();
  //   this.permissions$.toPromise().then((data: any) => {
  //     const f: boolean = data.some((p: PermissionOnResource) => (
  //       p.sub === permission.sub &&
  //       p.obj === permission.obj &&
  //       p.act === permission.act
  //     ));
  //     a.next(f);
  //   });

  //   return a;
  // }

}
