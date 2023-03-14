import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from 'src/app/pages/document-list/document-list.component';
import { FileEditorComponent } from 'src/app/pages/file-editor/file-editor.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentListComponent
  },
  {
    path: 'edit/:nodeId',
    component: FileEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
