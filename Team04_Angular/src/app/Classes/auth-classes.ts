export class AuthClasses {
}

export class Login{
    email:string = '';
    password:string = '';

    
}

export class ChangePassword{
    email:string = '';
    password:string = '';
    confirmPassword:string = '';
}

export class Register{
    name:string = '';
    surname:string = '';
    email:string = '';
    dob: Date = new Date;
    titleID: number = 1;
    languageID: number = 1;
    password:string = '';
    confirmPassword:string = '';
    image: string ='';
    cityID: number = 0;
}

export class JWTAuth{
    token = '';
    flag: boolean = true;
    message: any
}

