import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentEditorModule } from "@onlyoffice/document-editor-angular";
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DocumentListComponent } from 'src/app/pages/document-list/document-list.component';
import { FileEditorComponent } from 'src/app/pages/file-editor/file-editor.component';
import { AuthConfigModule } from '../config/auth.config.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    FileEditorComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DocumentEditorModule,
    TableModule,
    DialogModule,
    ButtonModule,
    MenuModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    ToolbarModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    AuthConfigModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
