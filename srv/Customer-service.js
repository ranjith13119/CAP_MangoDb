const cds = require("@sap/cds");
const handler = require("./handler");

module.exports = cds.service.impl(srv => {
    srv.on("CREATE", "Customer", handler.customerCRUD._createCustomer);
    srv.on("READ", "Customer", handler.customerCRUD._fetchCustomerDetails);
    srv.on("getCustomerByCountry", handler.customerCRUD._getCustomerByCountry);
    srv.on("UPDATE", "Customer", handler.customerCRUD._updateCustomerDetails);
    srv.on("DELETE", "Customer", handler.customerCRUD._deleteCustomerDetails);
})