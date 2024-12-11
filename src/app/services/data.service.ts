import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private basePath = 'assets/metadata'; // mock API response with JSON files

  constructor(private http: HttpClient) {}

  loadJson(fileName: string): Observable<any> {
    return this.http.get<any>(`${this.basePath}/${fileName}`);
  }
}
