import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule, AuthConfig } from 'angular-oauth2-oidc';

import { AuthConfigService } from './auth-config.service';
import { authConfig, OAuthModuleConfig } from './auth.config';
import { environment } from 'src/environments/environment';

export function init_app(authConfigService: AuthConfigService) {
    return () => authConfigService.initAuth();
}

@NgModule({
  imports: [ 
    HttpClientModule, 
    OAuthModule.forRoot({
      resourceServer: {
        // To send the jwt to the backend server when matching this url
        allowedUrls: [environment.BACKEND_BASE_URL],
        sendAccessToken: true
      }
    })
  ],
  providers: [
    AuthConfigService,
    { provide: AuthConfig, useValue: authConfig },
    OAuthModuleConfig,
    { 
      provide: APP_INITIALIZER, 
      useFactory: init_app, 
      deps: [ AuthConfigService ], 
      multi: true
    }
  ]
})
export class AuthConfigModule { }
