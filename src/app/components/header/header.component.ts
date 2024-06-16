import {Component, OnDestroy, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {MenuItem} from 'primeng/api';
import {UserProfile} from 'src/app/model/userprofile';
import {Router} from "@angular/router";
import {ROUTE_AUTHORIZATION, ROUTE_DOCUMENT_LIST} from "../../app-routing.module";
import {WebsocketService} from "../../service/websocket.service";
import {IMessage} from "@stomp/stompjs";
import {environment} from '../../../environments/environment';

interface InboxNotification {
  name: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  items!: MenuItem[];
  notifications: InboxNotification[] = [];

  constructor(
    private readonly oauthService: OAuthService,
    private readonly router: Router,
    private readonly websocketService: WebsocketService
  ) { }

  public get tokenSubject(): string | null {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['sub'];
  }

  async ngOnInit() {
    const userprofile = ((await this.oauthService.loadUserProfile()) as any).info as UserProfile;
    console.log(userprofile);
    console.log(this.oauthService.getIdToken())

    this.initWebsocketInboxNotification();
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }

  public initWebsocketInboxNotification() {
    this.websocketService.connect(
      environment.WEBSOCKET_ENDPOINT,
      {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`
      },
      [
        {
          destination: '/topic/greetings',
          callback: message => this.onTopicGreetingsMessage(message)
        },
        {
          destination: `/user/${this.tokenSubject}/queue/notifications`,
          callback: message => this.onUserNotification(message)
        }
      ]
    );
  }

  onTopicGreetingsMessage(message: IMessage) {
    console.log("onTopicGreetingsMessage: " + message.body);
  }

  onUserNotification(message: IMessage) {
    console.log("onUserNotification: " + message.body);
    this.notifications.push(JSON.parse(message.body))
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
