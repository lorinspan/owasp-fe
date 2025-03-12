import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-ssrf',
  imports: [CommonModule, FormsModule],
  templateUrl: './ssrf.component.html',
  styleUrls: ['./ssrf.component.css']
})
export class SSRFComponent {
  url: string = '';
  response: { message: string } = { message: '' };

  constructor(private http: HttpClient) {}

  checkStock() {
    this.http.post<{ message: string }>('http://localhost:8080/api/stores/check-stock', { url: this.url }, { responseType: 'json' })
      .subscribe(
        (data) => {
          console.log("Received:", data);
          this.response = data;
        },
        (error) => {
          console.error("Error:", error);
          this.response = { message: 'Error fetching stock!' };
        }
      );
  }
}
