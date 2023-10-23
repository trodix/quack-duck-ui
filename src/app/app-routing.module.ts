import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from 'src/app/pages/document-list/document-list.component';
import { FileEditorComponent } from 'src/app/pages/file-editor/file-editor.component';
import { PermissionManagerComponent } from "./pages/permission-manager/permission-manager.component";

export const ROUTE_DOCUMENT_LIST = "";
export const ROUTE_FILE_EDITOR = "edit/:nodeId";
export const ROUTE_AUTHORIZATION = "authorization";

const routes: Routes = [
  {
    path: ROUTE_DOCUMENT_LIST,
    component: DocumentListComponent
  },
  {
    path: ROUTE_FILE_EDITOR,
    component: FileEditorComponent
  },
  {
    path: ROUTE_AUTHORIZATION,
    component: PermissionManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
