import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-path-traversal',
  imports: [CommonModule, FormsModule],
  templateUrl: './path-traversal.component.html',
  styleUrl: './path-traversal.component.css'
})
export class PathTraversalComponent {
  filePath: string = '';
  response: string = '';

  constructor(private http: HttpClient) {}

  readFile() {
    this.http.post<{ message: string }>('http://localhost:8080/api/files/read', { path: this.filePath })
      .subscribe(response => {
        this.response = response.message;
      }, error => {
        this.response = 'Error reading file!';
      });
  }
}
