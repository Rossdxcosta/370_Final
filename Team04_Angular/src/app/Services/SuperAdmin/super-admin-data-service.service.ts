import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../Classes/users-classes';
import { Role } from '../../Classes/role-classes';
import { AccountRequestDTO } from '../../Classes/requests';
import { Department } from '../../Classes/department-classes';
import { Auditlog } from '../../Classes/auditlog';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminDataServiceService {
  private apiURL = "http://localhost:5120/api/SuperAdmin/";

  constructor(private http: HttpClient) { }

  //Audit log
  ViewAuditLog(): Observable<Auditlog[]>{
    return this.http.get<Auditlog[]>(this.apiURL + 'ViewAuditLog');
  }

  //Users
  GetAllUsers(): Observable<User[]>{
    var request = this.http.get<User[]>('http://localhost:5120/api/Users/GetAllUsers/');
    return request;
  }

  //Departments
  GetAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiURL + 'GetAllDepartments');
  }

  //Admins
  GetAllAdmins(): Observable<User[]>{
    return this.http.get<User[]>(this.apiURL + 'GetAllAdmins');
  }

  AssignAdmin(id: string): Observable<any>{
    return this.http.put<any>(this.apiURL + 'AssignAdmin/' + id, id);
  } 

  UpdateAdmin(id: string, updatedAdmin: User): Observable<any>{
    return this.http.put<any>(this.apiURL + 'UpdateAdmin/' + id, updatedAdmin);
  }

  DeleteAdmin(id: string): Observable<any>{
    return this.http.delete<any>(this.apiURL + 'DeleteAdmin/' + id);
  }

  //ROLES
  GetAllRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(this.apiURL + 'GetAllRoles');
  }

  AddRole(role: Role): Observable<void>{
    return this.http.post<void>(this.apiURL + 'AddRole', role);
  }

  EditRole(id: number, role: Role): Observable<void>{
    return this.http.put<void>(this.apiURL + 'UpdateRole/' + id, role);
  }

  DeleteRole(id: number): Observable<any>{
    return this.http.delete(this.apiURL + 'DeleteRole/' + id);
  }

  //Requests

  ViewAdminRequests(): Observable<AccountRequestDTO[]>{
    return this.http.get<AccountRequestDTO[]>(this.apiURL + 'ViewAdminRequests/');
  }

  AcceptAdminRequest(id: number): Observable<void>{
    return this.http.put<void>(this.apiURL + 'AcceptAdminRequest/' + id, id);
  }

  DenyAdminRequest(id: number): Observable<void>{
    return this.http.put<void>(this.apiURL + 'DenyAdminRequest/' + id, id);
  }
}