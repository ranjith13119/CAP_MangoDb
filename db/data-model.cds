namespace my.mongoDB;
using { temporal, managed, cuid, Currency} from '@sap/cds/common';

entity Customer :  managed {
    key id : String;
    name : String(256);
    type : String(2);
    emailId : String(110);
    contactNo : String(20);
    address: String(256);
    companyName: String(128);
    country : String;
}