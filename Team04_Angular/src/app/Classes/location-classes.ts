export class LocationClasses {

}

export class Country{
    country_ID: number = 0;
    name: string = '';
    iso3Code: string = '';
    native: string = '';
    states!: State[];
}

export class State{
    id: number = 0;
    name: string = '';
    state_Code: string = '';
    country_ID: number = 0;
    cities!: City[];
}

export class City{
    id: number = 0;
    name: string = '';
    state_ID: number = 0;
}
