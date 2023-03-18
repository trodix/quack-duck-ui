
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from 'src/app/model/userprofile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private readonly oauthService: OAuthService) { }

  async ngOnInit() {
    const userprofile = ((await this.oauthService.loadUserProfile()) as any).info as UserProfile;
    console.log(userprofile);
    console.log(this.oauthService.getIdToken())
  }

  public get email() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['email'];
  }

  logout() {
    this.oauthService.logOut();
  }

}
