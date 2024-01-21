import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthConfig} from "angular-oauth2-oidc/auth.config";

interface AppConfig {
  "BACKEND_BASE_URL": string,
  "ONLYOFFICE_BASE_URL": string,
  "keycloak": AuthConfig
}

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig | undefined;

  constructor (private injector: Injector) { }

  loadAppConfig() {
    let http = this.injector.get(HttpClient);

    return http.get<AppConfig>('/assets/app-config.json')
      .subscribe(data => this.appConfig = data);
  }

  get config() {
    return this.appConfig;
  }
}
