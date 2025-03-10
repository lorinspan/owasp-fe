import { Component, OnInit } from '@angular/core';
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
export class BrokenAccessControlComponent implements OnInit {
  username: string = '';
  password: string = '';
  authMessage: string = '';
  isLoggedIn: boolean = false;
  loggedInUser: any = null;
  viewedUser: any = null;
  users: any[] = [];
  adminData: any = null; // ✅ Conține date sensibile ale serverului

  constructor(private authService: BACAuthService, private route: ActivatedRoute, private router: Router) {
    this.restoreSession();
  }

  ngOnInit() {
    // Verifică dacă există user_id în parametrii rutei
    this.route.params.subscribe(params => {
      const userId = params['user_id'];
      if (userId) {
        this.loadUserById(userId);
        this.isLoggedIn = true;
      } else {
        // Dacă nu există user_id, redirecționează la /tests/broken-access-control
        this.router.navigate(['/tests/broken-access-control']);
        this.viewedUser = this.loggedInUser;
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
      this.users = this.users.filter(user => user.id !== userId);
      this.loadUsers(); // ✅ Refresh lista de useri după ștergere
    });
  }

  loadAdminPanel() {
    this.authService.getAdminConfig().subscribe(data => {
      this.adminData = data; // ✅ Orice user primește datele de admin
    });
  }

  logout() {
    localStorage.removeItem('BACToken');
    this.isLoggedIn = false;
    this.loggedInUser = null;
    this.authMessage = '';
    this.users = [];
    this.router.navigate(['/tests/broken-access-control']);
  }
}
