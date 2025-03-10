import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BACAuthService } from '../../../services/bac-auth.service';

@Component({
  selector: 'app-bac',
  standalone: true,
  templateUrl: './broken-access-control.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./broken-access-control.component.css']
})
export class BrokenAccessControlComponent {
  username: string = '';
  password: string = '';
  authMessage: string = '';
  isLoggedIn: boolean = false;
  loggedInUser: any = null;
  viewedUser: any = null; // Userul vizualizat pe baza URL-ului
  users: any[] = [];

  constructor(private authService: BACAuthService, private route: ActivatedRoute, private router: Router) {
    this.restoreSession();

    this.route.params.subscribe(params => {
      const userId = params['user_id'];
      if (userId) {
        this.loadUserById(userId);
        this.isLoggedIn = true; // ✅ Chiar dacă nu este logat, se consideră că vizualizează un user
      }
    });
  }

  restoreSession() {
    const storedUser = localStorage.getItem('BACToken');
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser);
      this.isLoggedIn = true;
    }
      this.loadUsers();
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(user => {
      if (user) {
        localStorage.setItem('BACToken', JSON.stringify(user));
        this.isLoggedIn = true;
        this.loggedInUser = user;
        this.authMessage = 'Authenticated';

        // 🔥 După login, îl redirecționează la pagina userului logat
        this.router.navigate([`/tests/broken-access-control/${user.id}`]);

        this.loadUsers();
      } else {
        this.authMessage = '❌ Authentication failed!';
      }
    }, () => {
      this.authMessage = '❌ Authentication failed!';
    });
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadUserById(userId: number) {
    this.authService.getUserById(userId).subscribe(user => {
      this.viewedUser = user;
    });
  }

  updateUser(user: any) {
    this.authService.updateUser(user.id, user).subscribe(updatedUser => {
      const index = this.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
    });
  }

  deleteUser(userId: number) {
    this.authService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId); // 🛑 Elimină userul din listă fără nicio verificare
    });
  }


  logout() {
    localStorage.removeItem('BACToken');
    this.isLoggedIn = false;
    this.loggedInUser = null;
    this.authMessage = '';
    this.users = [];

    this.router.navigate(['/tests/broken-access-control']); // ✅ Redirecționare corectă la logout
  }
}
