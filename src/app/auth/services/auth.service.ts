import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, filter, map } from "rxjs";

import { environment } from "src/environments/environment";
import { CurrentUserInterface } from "../types/current-user.interface";
import { RegisterRequestInterface } from "../types/register-request.interface";
import { LoginRequestInterface } from "../types/login-request.interfacat";
import { SocketService } from "src/app/shared/services/socket.service";

@Injectable()
export class AuthService {
  api = environment.url;

  // Behavior subject to handle user details
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined);

  isLogged$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean),
  )

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  // Function to get user details from server
  getCurrentUser(): Observable<CurrentUserInterface> {
    // Return the get observable with derived data from server to subscribe
    return this.http.get<CurrentUserInterface>(`${this.api}/user`);
  }

  // Function to register user
  register(registerRequest: RegisterRequestInterface): Observable<CurrentUserInterface> {
    // Call api and return the observable of registration api
    const url = `${this.api}/users`
    return this.http.post<CurrentUserInterface>(
      url,
      registerRequest
    )
  }

  // Function to login
  login(loginRequest: LoginRequestInterface): Observable<CurrentUserInterface> {
    // Call api and return the observable of registration api
    const url = `${this.api}/users/login`
    return this.http.post<CurrentUserInterface>(
      url,
      loginRequest
    )
  }

  // Function to set token in local storage
  setToken(currentUser: CurrentUserInterface): void {
    // Set token in local storage
    localStorage.setItem('token', currentUser.token.toString());
  }

  // Function to send around the application
  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }

  // Logout Function
  logOut(): void {
    // Remove token from locastorage
    localStorage.removeItem('token');

    // Notify every components user loged out.
    this.currentUser$.next(null);

    // Disconnect socket connection
    this.socketService.disconnect();
  }
}