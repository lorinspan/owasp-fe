import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-crypto-fail',
  imports: [FormsModule, CommonModule],
  templateUrl: './crypto-fail.component.html',
  styleUrl: './crypto-fail.component.css'
})
export class CryptoFailComponent {
  username: string = '';
  password: string = '';
  email: string = '';

  constructor(private http: HttpClient) {}

  onRegister() {
    const payload = { username: this.username, password: this.password, email: this.email };

    this.http.post('http://localhost:8080/api/cf/register', payload).subscribe(response => {
      console.log('User registered!', response);
    });
  }
}
