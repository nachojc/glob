import { Branch } from '../models/branch.model';

export const branchMock: Branch = {
    hasAccesibility: null,
    id: '5d8b6968048ccee51add3042',
    code: 'Santander_UK_UK_B798',
    entityCode: 'Santander_UK',
    name: 'Milton Keynes GG',
    action: null,
    poiStatus: 'ACTIVE',
    objectType: {
        multi: {
            default: 'BRANCH',
            es: 'BRANCH'
        },
        code: 'BRANCH'
    },
    subType: null,
    specialType: null,
    description: null,
    status: null,
    location: {
        type: 'Point',
        coordinates: [-0.77027524, 52.037222],
        address: 'Santander House, 201, Grafton Gate East, Milton Keynes, Buckinghamshire, MK9 1AN',
        zipcode: 'MK9 1AN',
        city: 'Milton Keynes',
        country: 'UK',
        locationDetails: null,
        parking: null,
        geoCoords: { latitude: 52.037222, longitude: -0.77027524},
        urlPhoto: null,
        descriptionPhoto: null
    },
    distanceInKm: 0.39915483283281106,
    distanceInMiles: 0.6386477325324977,
    contactData: null,
    socialData: {
        youtubeLink: 'https://www.youtube.com/user/UKSantander',
        facebookLink: 'https://www.facebook.com/santanderuk/',
        twitterLink: 'https://twitter.com/santanderuk',
        linkedinLink: 'https://www.linkedin.com/company/santander-uk-corporate-&-commercial',
        instagramLink: null,
        googleLink: null
    },
    appointment: {
        waitingTimeTeller: null,
        waitingTimeSpecialist: null,
        branchAppointment: 'https://www.santander.co.uk/uk/book-an-appointment'
    },
    schedule: {
        workingDay: {
          WEDNESDAY: ['09:30-17:00'],
          MONDAY: ['09:30-17:00'],
          THURSDAY: ['09:30-17:00'],
          SUNDAY: [],
          TUESDAY: ['09:30-17:00'],
          FRIDAY: ['09:30-17:00'],
          SATURDAY: []},
        specialDay: []
    },
    comercialProducts: [
        {
            default: 'investment',
            br: 'investimentos'
        }
    ],
    banner: null,
    spokenlanguages: ['EN'],
    attrib: [
        {
            multi: {
                br: 'YES',
                default: 'YES'
            },
            code: 'ACCESIBILITY'
        },
        {
            multi: {
                br: 'NO',
                default: 'NO'
            },
            code: 'ATM'
        },
        {
            multi: {
                br: 'Sacar dinheiro',
                default: 'Cash withdraw'
            },
            code: 'CASH_WITHDRAW'
        },
        {
            multi: {
                default: 'SI'
            },
            code: 'CONTACTLESS'
        },
        {
            multi: null,
            code: 'LOW_DENOMINATION_BILL'
        },
        {
            multi: null,
            code: ''
        }
    ],
    richTexts: [],
    people: null,
    events: null,
    store: '',
    urlDetailPage: '',
    dialogAttribute: null,
    updatedTime: 1569417528615,
    hideURLDetail: 'NO',
    poicode: 'B798'
};
