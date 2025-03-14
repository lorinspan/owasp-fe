import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {BrokenAuthAuthService} from '../../../services/broken-auth.auth.service';

@Component({
  selector: 'app-broken-auth',
  standalone: true,
  templateUrl: './broken-auth.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./broken-auth.component.css']
})
export class BrokenAuthComponent {
  username: string = '';
  password: string = '';
  authMessage: string = '';
  isLoggedIn: boolean = false;
  loggedInUser: { userId: number; username: string } | null = null;
  sessionToken: string = '';

  constructor(private authService: BrokenAuthAuthService) {
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.status === "success") {
        localStorage.setItem('BAAuthToken', response.token);
        document.cookie = `BAAuthToken=${response.token}; path=/;`;

        this.isLoggedIn = true;
        this.loggedInUser = { userId: response.userId, username: response.username };
        this.sessionToken = response.token;
        this.authMessage = 'Authenticated';
      } else {
        this.authMessage = 'Authentication failed';
      }
    });
  }

  logout() { // Nu invalidăm sesiunea pe server
    localStorage.removeItem('BAAuthToken');
    document.cookie = `BAAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

    this.isLoggedIn = false;
    this.loggedInUser = null;
    this.sessionToken = '';
    this.authMessage = '';
  }

}
