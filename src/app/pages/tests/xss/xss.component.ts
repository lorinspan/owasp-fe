import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-xss',
  standalone: true,
  templateUrl: './xss.component.html',
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./xss.component.css']
})
export class XssComponent {
  name: string = '';
  message: string = '';
  feedbackList: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.loadFeedback();
  }

  submitFeedback() {
    this.http.post('http://localhost:8080/api/feedback/submit', { name: this.name, message: this.message }).subscribe(() => {
      this.loadFeedback();
    });
  }

  loadFeedback() {
    this.http.get<any[]>('http://localhost:8080/api/feedback/list').subscribe(data => {
      this.feedbackList = data.map(fb => ({
        name: fb.name,
        message: this.sanitizer.bypassSecurityTrustHtml(fb.message) // Xss permis
      }));
    });
  }

}
