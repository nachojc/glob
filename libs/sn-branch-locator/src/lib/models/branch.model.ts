export class Branch {
    id: string;
    code: string;
    entityCode: string;
    name: string;
    action: null; // TODO: verify
    poiStatus: string; // TODO: change to enum?
    objectType: {
        multi: {
            default: string;
            es: string;
        },
        code: string; // TODO: change to enum?
    };
    subType: string;
    specialType: string;
    description: string;
    status: string;
    location: {
        type: string;
        coordinates: number[];
        address: string;
        zipcode: string;
        city: string;
        country: string;
        locationDetails: string;
        parking: string;
        geoCoords: {
            latitude: number;
            longitude: number;
        };
        urlPhoto: string;
        descriptionPhoto: string;
    };
    distanceInKm: number;
    distanceInMiles: number;
    contactData: string;
    socialData: {
        youtubeLink: string;
        facebookLink: string;
        twitterLink: string;
        linkedinLink: string;
        instagramLink: string;
        googleLink: string;
    };
    appointment: {
        waitingTimeTeller: string;
        waitingTimeSpecialist: string;
        branchAppointment: string;
    };
    schedule: {
        workingDay: {
            WEDNESDAY: string[];
            MONDAY: string[];
            THURSDAY: string[];
            SUNDAY: string[];
            TUESDAY: string[];
            FRIDAY: string[];
            SATURDAY: string[];
        },
        specialDay: []
    };
    comercialProducts: Array<{
        default: string;
        es: string
    }>;
    banner: null;
    spokenlanguages: string[];
    attrib: Array<{
        multi: {
            default: string;
            es: string;
        };
        code: string;
    }>;
    richTexts: Array<{
        multi: {
            default: string;
            es: string;
        },
        code: string;
    }>;
    people: null;
    events: null;
    store: string;
    urlDetailPage: string;
    dialogAttribute: {
        WIFI: boolean
    };
    updatedTime: number;
    hideURLDetail: string;
    poicode: string;
}
