export class DayDream {

    totalCost: Number;
    ID: string;
    completed: Boolean;
    individualContribution: [{
        user: String,
        money: Number
    }];
    excursions: [{
        user: String,
        cost: Number,
        information: String,
        category: String
    }];
    lodgingInformation: [{
        address: String,
        cost: Number,
        user: String,
    }];
    travelInformation: [{
        mode: String,   /* vehicle, plane, bus, etc */
        cost: Number,
        user: String,
    }];
    images: [{
        url: String,
        id: String
    }]
    destination: {type: String};
    description: {type: String};
    
    constructor(response: any) {
        this.ID = response._id;
        this.totalCost = response.totalCost
        this.completed = response.completed
        this.description = response.description
        this.destination = response.destination
        this.travelInformation = response.travelInformation
        this.lodgingInformation = response.lodgingInformation
        this.excursions = response.excursions
        this.individualContribution = response.individualContribution
        this.images = response.images
    }
}