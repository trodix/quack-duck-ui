import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DocumentListComponent } from 'src/app/pages/document-list/document-list.component';
import { FileEditorComponent } from 'src/app/pages/file-editor/file-editor.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentEditorModule } from "@onlyoffice/document-editor-angular";

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    FileEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DocumentEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
