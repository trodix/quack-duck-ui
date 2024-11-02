import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DocumentEditorModule} from "@onlyoffice/document-editor-angular";
import {MessageService} from 'primeng/api';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {DocumentListComponent} from 'src/app/pages/document-list/document-list.component';
import {FileEditorComponent} from 'src/app/pages/file-editor/file-editor.component';
import {AuthConfigModule} from '../config/auth.config.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {PropertyPipe} from './pipes/property.pipe';
import {SizePipe} from './pipes/size.pipe';
import {TreeFileSelectorComponent} from './components/tree-file-selector/tree-file-selector.component';
import {NodePermissionManagerComponent} from './components/node-permission-manager/node-permission-manager.component';
import {DropdownModule} from 'primeng/dropdown';
import {PermissionManagerComponent} from './pages/permission-manager/permission-manager.component';
import {SearchDocumentsComponent} from './components/search-documents/search-documents.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {GalleriaModule} from "primeng/galleria";
import {ImageModule} from "primeng/image";
import {PaginatorModule} from "primeng/paginator";
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';
import {NodeInfoViewerComponent} from './components/node-info-viewer/node-info-viewer.component';
import {ChipModule} from "primeng/chip";
import {TreeModule} from "primeng/tree";
import {TreeViewComponent} from "./components/tree-view/tree-view.component";


@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    FileEditorComponent,
    HeaderComponent,
    PropertyPipe,
    SizePipe,
    TreeFileSelectorComponent,
    NodePermissionManagerComponent,
    PermissionManagerComponent,
    SearchDocumentsComponent,
    SidebarComponent,
    ImageViewerComponent,
    NodeInfoViewerComponent,
    TreeViewComponent
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
    FormsModule,
    ToastModule,
    InputTextModule,
    AuthConfigModule,
    DropdownModule,
    AutoCompleteModule,
    GalleriaModule,
    ImageModule,
    PaginatorModule,
    ChipModule,
    PaginatorModule,
    TreeModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
