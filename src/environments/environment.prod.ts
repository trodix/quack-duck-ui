export const environment = {
  production: true,
  BACKEND_BASE_URL: 'https://api.trodix.com/api/v1', // dont use localhost, only office container will connect to its own localhost
  ONLYOFFICE_BASE_URL: 'https://onlyoffice.trodix.com',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'https://auth.trodix.com/realms/duckcloud',

    // URL of the SPA to redirect the user to after login
    redirectUri: 'https://ged.trodix.com/',

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
    requireHttps: true,
    // at_hash is not present in JWT token
    showDebugInformation: false,
    disableAtHashCheck: true
  }
};
