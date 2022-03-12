using {my.mongoDB as db} from '../db/data-model';

service CustomerService {
    entity Customer as projection on db.Customer;
    action getCustomerByCountry() returns array of { _id : String ; count : Integer64 ;}
}