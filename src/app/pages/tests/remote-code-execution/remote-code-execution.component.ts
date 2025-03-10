import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-remote-code-execution',
  imports: [CommonModule, FormsModule],
  templateUrl: './remote-code-execution.component.html',
  styleUrl: './remote-code-execution.component.css'
})
export class RemoteCodeExecutionComponent {
  command: string = ''; // Input-ul utilizatorului
  response: string = ''; // Rezultatul comenzii

  constructor(private http: HttpClient) {}

  runCommand() {
    this.http.post<{ output: string }>('http://localhost:8080/api/system/execute', { command: this.command })
      .subscribe(response => {
        this.response = response.output;
      }, error => {
        this.response = '❌ Error executing command!';
      });
  }
}
