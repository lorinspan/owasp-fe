import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-crypto-fail',
  imports: [FormsModule, CommonModule],
  templateUrl: './crypto-fail.component.html',
  styleUrl: './crypto-fail.component.css'
})
export class CryptoFailComponent implements OnInit{
  username: string = '';
  password: string = '';
  email: string = '';
  loginUsername: string = '';
  loginPassword: string = '';
  newEmail: string = '';
  loggedInUser: any = null;
  isLoggedIn: boolean = false;
  activeTab: string = 'login'; // Default tab

  constructor(private http: HttpClient) {}

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onRegister() {
    const payload = { username: this.username, password: this.password, email: this.email };

    this.http.post('http://localhost:8080/api/cf/register', payload).subscribe(response => {
      console.log('User registered!', response);
    });
  }

  onLogin() {
    const payload = { username: this.loginUsername, password: this.loginPassword };

    this.http.post('http://localhost:8080/api/cf/login', payload).subscribe(response => {
      this.loggedInUser = response;
      this.isLoggedIn = true;
      localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
      console.log('Logged in successfully!', response);
    });
  }

  onChangeEmail() {
    const payload = { email: this.newEmail };

    this.http.put(`http://localhost:8080/api/cf/users/${this.loggedInUser.id}/email`, payload).subscribe(response => {
      console.log('Email changed!', response);

      // 🔄 Actualizăm email-ul în `loggedInUser` și localStorage
      this.loggedInUser.email = this.newEmail;
      localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
    });
  }


  logout() {
    this.isLoggedIn = false;
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser);
      this.isLoggedIn = true;
    }

    document.getElementById('claim-btn')?.addEventListener('click', () => {
      if (this.loggedInUser) {
        // Deschide într-un tab nou
        window.open(`http://localhost:9000/index.html?id=${this.loggedInUser.id}`, '_blank');
      } else {
        alert("You must be logged in to claim the prize!"); // ✅ Afișăm alertă dacă userul nu e logat
      }
    });


  }
}
