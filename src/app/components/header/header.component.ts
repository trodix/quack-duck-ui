
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { MenuItem } from 'primeng/api';
import { UserProfile } from 'src/app/model/userprofile';
import {Router} from "@angular/router";
import {ROUTE_AUTHORIZATION, ROUTE_DOCUMENT_LIST} from "../../app-routing.module";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  items!: MenuItem[];

  constructor(private readonly oauthService: OAuthService, private readonly router: Router) { }

  async ngOnInit() {
    const userprofile = ((await this.oauthService.loadUserProfile()) as any).info as UserProfile;
    console.log(userprofile);
    console.log(this.oauthService.getIdToken())
  }

  public getRouteHome() {
    return ROUTE_DOCUMENT_LIST;
}

  public get email() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['email'];
  }

  logout() {
    this.oauthService.logOut();
  }

  onClickMenu(menu: any, event: any): void {

    this.items = [];

    const adminMenu: MenuItem = {
      id: "common",
      label: `Admin console`,
      items: [
        {
          label: 'Manage authorizations',
          icon: 'pi pi-lock',
          styleClass: '',
          command: () => {
            this.router.navigateByUrl(ROUTE_AUTHORIZATION)
          }
        }
      ]
    };

    const accountMenu: MenuItem = {
      id: "common",
      label: `Account`,
      items: [
        {
          label: 'Logout',
          icon: 'pi pi-power-off',
          styleClass: 'menu-text-color-danger',
          command: () => {
            this.logout();
          }
        }
      ]
    };

    if (this.isAdmin()) {
      this.items.push(adminMenu);
    }

    this.items.push(accountMenu);

    menu.toggle(event);
  }

  isAdmin(): boolean {
    // TODO
    return true;
  }

}
