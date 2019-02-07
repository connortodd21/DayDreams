export class Circle {

    founder: string;
    members: string;
    circleName: string;
    dateCreated: string;
    numberOfPeople: Number;
    dayDreams:string;
    chat: [{
        user: string,
        message: string,
    }];

    constructor(response: any) {
        this.founder = response.founder;
        this.members = response.members;
        this.circleName = response.circleName;
        this.dateCreated = response.dateCreated;
        this.numberOfPeople = response.numberOfPeople;
        this.dayDreams = response.dayDreams;
        this.chat = response.chat;
        
        
    }
}