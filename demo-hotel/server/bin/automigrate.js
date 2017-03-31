
var path = require('path');

var app = require(path.resolve(__dirname, '../server'));
let mysql = app.dataSources.mysql;
let User = app.models.user;

mysql.automigrate('ACL', function (err) {

});

mysql.automigrate('user', function (err) {
    // User.create({
    //     password: '123456789',
    //     email:'katanhich@gmail.com',
    //     emailVerified: 1
    // })
});

mysql.automigrate('AccessToken', function (err) {

});

mysql.automigrate('RoleMapping', function (err) {

});

mysql.automigrate('Role', function (err) {

});

mysql.automigrate('hotel', function (err) {
    // app.models.hotel.create([
    //     { name: 'phuoc' },
    //     { name: 'dep' }
    // ])
    console.log("x");
    mysql.disconnect();
});