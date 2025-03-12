import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrokenAuthAuthService {
  private apiUrl = 'http://localhost:8080/api/ba-auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> { // Login nesecurizat, fara hashing, fara rate-limiting
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }
}
