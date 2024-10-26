import { Injectable } from '@angular/core';
import { JWTAuth } from '../../Classes/auth-classes';
import { HttpClient } from '@angular/common/http';
import { Title, User, UserEditDTO, language } from '../../Classes/users-classes';
import { Observable } from 'rxjs';
import { AccountRequestDTO, User_Account_Deactivate_Request, User_Account_Request, User_Account_creation_Request } from '../../Classes/requests';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://localhost:5120/api/Users';
  static getUserIDFromToken: any;

  constructor(private http: HttpClient) {}

  GetAllUsers(): Observable<any[]> {
    var userList = this.http.get<any[]>(this.apiUrl+'/GetAllUsers').subscribe(a => console.log(a));
    return this.http.get<any[]>(this.apiUrl+'/GetAllUsers');
  }

  GetUserById(id: number): Observable<User> {
    return this.http.get<User>(this.apiUrl+'/GetUserByID/' + id);
  }

  GetAllTitles(): Observable<Title[]> {
    var titles = this.http.get<Title[]>(this.apiUrl+'/GetTitles').subscribe(a => console.log(a));
    return this.http.get<Title[]>(this.apiUrl+'/GetTitles');
  }

  GetAllLanguages(): Observable<language[]> {
    var langs = this.http.get<language[]>(this.apiUrl+'/GetLanguages').subscribe(a => console.log(a));
    return this.http.get<language[]>(this.apiUrl+'/GetLanguages');
  }

  GetUserImage(id: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/GetUserImage/'+ id);
  }
//Sends request to backend
  RequestDeactivation(request: User_Account_Deactivate_Request): Observable<any> {
   // var langs = this.http.post<any>(this.apiUrl+'/DeactivateRequest', request).subscribe(a => console.log(a));
   // console.log(langs)
    return this.http.post<any>(this.apiUrl+'/DeactivateRequest', request);
  }

  GetAllDeactRequests(): Observable<User_Account_Request[]> {
   // var titles = this.http.get<User_Account_Request[]>(this.apiUrl+'/ViewAllDeactivationRequests').subscribe(a => console.log(a));
   // console.log(titles)
    return this.http.get<User_Account_Request[]>(this.apiUrl+'/ViewAllDeactivationRequests');
  }

  DeactivateAccount(UserID: string): Observable<any[]> {
    //var titles = this.http.get<any[]>(this.apiUrl+'/ViewAllDeactivationRequests').subscribe(a => console.log(a));
    //console.log(titles)
    return this.http.post<any[]>(this.apiUrl+'/DeactivateAccount/'+ UserID,UserID);
  }

  GetUser(): Observable<User> {
    // var titles = this.http.get<User_Account_Request[]>(this.apiUrl+'/ViewAllDeactivationRequests').subscribe(a => console.log(a));
    // console.log(titles)
     return this.http.get<User>(this.apiUrl+'/GetUserByID/'+ this.getUserIDFromToken());
   }

   UpdateUser(user : UserEditDTO): Observable<any> {
    return this.http.post<any[]>(this.apiUrl+'/UpdateUser',user);
   }

  getUserIDFromToken(){
    try {
      var jwtDto = sessionStorage.getItem('jwtToken')!
      var base64Url = jwtDto.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var obj = JSON.parse(jsonPayload)
      var secondKey = Object.keys(obj)[0];
      //console.log(obj)
      //console.log(obj[secondKey])
      return(obj[secondKey])
      
    } catch (error) {
      console.log(error)
      console.log('probably not logged in')
      return(error)
    }
  }

  getUserNameFromToken(){
    try {
      var jwtDto = sessionStorage.getItem('jwtToken')!
      var base64Url = jwtDto.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var obj = JSON.parse(jsonPayload)
      var secondKey = Object.keys(obj)[1];
      //console.log(obj)
      //console.log(obj[secondKey])
      return(obj[secondKey])
      
    } catch (error) {
      console.log(error)
      console.log('probably not logged in')
      return(error)
    }
  }

  getUserRoleFromToken(){
    try {
      var jwtDto = sessionStorage.getItem('jwtToken')!
      var base64Url = jwtDto.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var obj = JSON.parse(jsonPayload)
      var secondKey = Object.keys(obj)[3];
      //console.log(obj)
      return(obj[secondKey])
      
    } catch (error) {
      console.log(error)
      console.log('probably not logged in')
      return(error)
    }
  }

  RequestAccount(request: User_Account_creation_Request): Observable<any> {
     return this.http.post<any>(this.apiUrl+'/AddUserAccountRequest', request);
   }
}
