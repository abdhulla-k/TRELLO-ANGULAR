import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { CurrentUserInterface } from "../types/current-user.interface";

@Injectable()
export class AuthService {
  api = environment.url;

  // Behavior subject to handle user details
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined);

  constructor(private http: HttpClient) { }

  // Function to get user details from server
  getCurrentUser(): Observable<CurrentUserInterface> {
    // Return the get observable with derived data from server to subscribe
    return this.http.get<CurrentUserInterface>(`${this.api}/user`);
  }

  // Function to save user details to local
  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }
}