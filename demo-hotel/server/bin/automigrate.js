
var path = require('path');

var app = require(path.resolve(__dirname, '../server'));
let mysql = app.dataSources.mysql;
let User = app.models.user;
let Role = app.models.Role;
let RoleMapping = app.models.RoleMapping;

mysql.automigrate('ACL', function (err) {

});

mysql.automigrate('user', function (err) {
    var users;

    User.create({
        password: '123456789',
        email:'katanhich@gmail.com',
        emailVerified: 1
    }).then( createdUsers => {
        users = createdUsers;
        console.log('created users: ', users);  
        return Role.create({name: 'admin'});
    }).then( role => {
        console.log('created role: ', role);

        return role.principals.create({
            principalType: RoleMapping.USER,
            principalId: users.id
        });
    }).then( principal => {
        console.log('created principal: ', principal);
    }).catch(err => {
        throw err;
    });
});

mysql.automigrate('AccessToken', function (err) {

});

mysql.automigrate('RoleMapping', function (err) {

});

mysql.automigrate('Role', function (err) {

});

mysql.automigrate('hotel', function (err) {
    app.models.hotel.create([
        { name: 'phuoc' },
        { name: 'dep' }
    ])
    console.log("x");
    // mysql.disconnect();
});

mysql.automigrate('Service', function (err) {
    app.models.Service.create([
        { name: 'spa', price: 10 },
        { name: 'nails', price: 20 },
        { name: 'lam toc', price: 30 }
    ])
});