import { Role } from "./role-classes"
import { User } from "./users-classes"

export class User_Account_Request{
    request_ID: number = 0;
    role_ID: number = 0;
    user_ID: string = '';
    role: Role = new Role;
    user: User = new User;
    request_Date: Date = new Date;
    reason: string = '';
};

export class AccountRequestDTO{
    request: User_Account_Request = new User_Account_Request;
    currentUserRole: Role = new Role;
}

//mirrors dto/viewmodel on the api
export class User_Account_Deactivate_Request{
    userID: string = '';
    requestType: number = 2;
    reason: string = '';
};

export class User_Account_creation_Request{
    role_ID: number = 0;
    user_ID: string = '';
    request_Type_ID: number = 1;
    request_Date: Date = new Date;
    reason: string = '';
};