// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BACKEND_BASE_URL: 'http://trodix.local:8010/api/v1', // dont use localhost, only office container will connect to its own localhost
  ONLYOFFICE_BASE_URL: 'http://trodix.local:6080',
  WEBSOCKET_ENDPOINT: 'ws://localhost:8010/ws',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://trodix.local:8080/realms/market',

    // URL of the SPA to redirect the user to after login
    redirectUri: 'http://localhost:4200/',

    // The SPA's id.
    // The SPA is registerd with this id at the auth-server
    clientId: 'quack-duck-ecm-ui',

    responseType: 'code',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    scope: 'openid profile email',
    // Remove the requirement of using Https to simplify the demo
    // THIS SHOULD NOT BE USED IN PRODUCTION
    // USE A CERTIFICATE FOR YOUR IDP
    // IN PRODUCTION
    requireHttps: false,
    // at_hash is not present in JWT token
    showDebugInformation: true,
    disableAtHashCheck: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
