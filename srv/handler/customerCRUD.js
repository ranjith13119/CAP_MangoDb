const cds = require('@sap/cds');
const MongoClient = require("mongodb").MongoClient;
const PASSWORD = encodeURIComponent('Edu@123456789');
require('dotenv').config();
const uri = process.env.HOST_URL;
const db_name = "customers";
const objectId = require('mongodb').ObjectID;
const mangoDBClient = new MongoClient(uri);

const _createCustomer = async (req) => {
    await mangoDBClient.connect();
    const db = await mangoDBClient.db(db_name);
    const customer = await db.collection("Customers");
    const { insertedId } = await customer.insertOne(req.data);
    if (insertedId) {
        req.data.Id = insertedId;
    } else {
        req.reject("409", "Could not insert the data");
    }
    return req.data;
};

const _fetchCustomerDetails = async (req) => {
    await mangoDBClient.connect();
    var limitRows = 1000, offset = 0, filter;
    const db = await mangoDBClient.db(db_name);
    const collection_Customers = await db.collection("Customers");
    const { limit } = req.query.SELECT;
    if (limit) {
        limitRows = limit.rows.val;
        if (limit.offset) offset = limit.offset.val;
    }
    if (req.query.SELECT.one) filter = { _id: objectId(req.query.SELECT.from.ref[0].where[2].val) };
    const result = await collection_Customers.find(filter).limit(limitRows + offset).toArray();
    result.slice(offset);
    await result.forEach(item => {
        item.id = item._id.toString();
    });
    return result;
};

const _getCustomerByCountry = async (req) => {
    await mangoDBClient.connect();
    const db = await mangoDBClient.db(db_name);
    const customer = await db.collection("Customers");
    const results = await customer.aggregate([
        { $match: { type: "M" } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },

    ]);
    return results.toArray();
};

const _updateCustomerDetails = async (req) => {
    await mangoDBClient.connect();
    const db = await mangoDBClient.db(db_name);
    const customer = await db.collection("Customers");
    const data = req.data;
    const _sid = objectId(data.id);
    delete data.id

    const { modifiedCount } = await customer.updateOne(
        { _id: _sid },
        { $set: data }
    );

    if (modifiedCount) {
        delete data._id;
        data.id = _sid;
        return data;
    } else {
        return "Couldn't Update";
    }
};

const _deleteCustomerDetails = async (req) => {
    await mangoDBClient.connect();
    const db = await mangoDBClient.db(db_name);
    const customer = await db.collection("Customers");
    const _sid = objectId(req.data.id);
    return await customer.deleteOne({ _id: _sid });
}

module.exports = {
    _createCustomer,
    _fetchCustomerDetails,
    _getCustomerByCountry,
    _updateCustomerDetails,
    _deleteCustomerDetails
};