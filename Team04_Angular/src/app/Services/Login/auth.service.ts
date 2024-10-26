import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangePassword, JWTAuth, Login, Register } from '../../Classes/auth-classes';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ImagesUploadService } from '../Supabase/images-upload.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  registerUrl = 'http://localhost:5120/api/Users/Register';
  loginUrl = 'http://localhost:5120/api/Users/Login';
  appUrl = 'http://localhost:5120/api/Users/'
  //adminWeatherUrl = 'https://localhost:7293/WeatherForecast/user';

  isLoggedIn(): Boolean {
    return !!sessionStorage.getItem("jwtToken");
  }

  constructor(private http: HttpClient, private router: Router, private supabaseService: ImagesUploadService) { }

  async generateSupabaseToken(){
    await this.supabaseService.supabase.auth.signInAnonymously().then((bruh: any) => {console.log(bruh)})
  }

  public register(user: Register): Observable<JWTAuth> {
    return this.http.post<JWTAuth>(this.registerUrl, user);
  }

  public login(user: Login): Observable<JWTAuth> {
    return this.http.post<JWTAuth>(this.loginUrl, user);
  }

  /*public getAdminWeather(): Observable<any> {
    return this.http.get<any>(this.adminWeatherUrl)
  }*/

    public checkPassword(user: Login): Observable<JWTAuth>{
      return this.http.post<JWTAuth>(this.appUrl+'CheckPassword', user)
    }

    public checkOTP(user: Login): Observable<boolean>{
      return this.http.post<boolean>(this.appUrl+'CheckOtp', user)
    }

    public sendOTP(user: Login): Observable<boolean>{
      return this.http.post<boolean>(this.appUrl+'SendOtp', user)
    }

    public sendCEOTP(user: Login): Observable<boolean>{
      return this.http.post<boolean>(this.appUrl+'SendCEOtp', user)
    }

    public ChangePassword(user: ChangePassword): Observable<boolean>{
      return this.http.post<boolean>(this.appUrl+'ChangePassword', user)
    }

    public ReactivateAccount(user: Login): Observable<JWTAuth>{
      return this.http.post<JWTAuth>(this.appUrl+'ReactivateAccount', user)
    }

    public VerifySecCode(user: Login): Observable<JWTAuth>{
      return this.http.post<JWTAuth>(this.appUrl+'ReactivateAccount', user)
    }

  public logout() {
    if (sessionStorage.getItem('jwtToken')) {
      sessionStorage.removeItem('jwtToken');
    }
    this.router.navigate(['/']);
  }

  getUserEmailFromToken(){
    try {
      var jwtDto = sessionStorage.getItem('jwtToken')!
      //console.log(jwtDto)
      var base64Url = jwtDto.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var obj = JSON.parse(jsonPayload)
      var secondKey = Object.keys(obj)[2];
      //console.log(obj)
      //console.log(obj[secondKey])
      return(obj[secondKey])
      
    } catch (error) {
      console.log(error)
      console.log('probably not logged in')
      return(error)
    }
  }
}
