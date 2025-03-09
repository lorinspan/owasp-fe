import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrokenAuthAuthService {
  private apiUrl = 'http://localhost:8080/api/ba-auth';

  constructor(private http: HttpClient) {}

  // ❌ Login nesecurizat, fără hashing, fără rate-limiting
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  // ❌ Sesiune stocată local, fără protecție
  getLoggedInUser() {
    const token = localStorage.getItem('BAAuthToken');
    if (token) {
      return { userId: 1, username: 'MockUser' }; // ❌ Hardcoded (nesecurizat)
    }
    return null;
  }
}
