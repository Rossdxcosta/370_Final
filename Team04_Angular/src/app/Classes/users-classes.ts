import { Role } from "./role-classes";
import { Department } from "./department-classes";

export class User{
    user_ID: string = '';
    user_Name: string = '';
    user_Surname: string = '';
    email: string = '';
    user_DOB: Date = new Date();
    user_LastLogin: Date = new Date();
    language_ID: number = 0;
    title_ID: number = 0;
    phone:string = '';
    login_Status_ID: number = 0;
    credential_ID: string = '';
    role_ID: number = 0;
    department_ID: number = 0;
    role: Role = new Role;
    department: Department = new Department;
    isActive: boolean = true;
}

export class Title{
    title_ID: number = 1;
    title_Description: string = '';
}

export class language{
    language_ID: number = 1;
    description: string = '';
}

export class company{
    company_ID: number = 1;
    description: string = '';
}

export class UserEditDTO{
    name: string = '';
    surname: string = '';
    email: string = '';
    phone: string = ''
    user_DOB: Date = new Date();
    language_ID: number = 0;
    title_ID: number = 0;
}

