
module.exports = function (app) {
    let mongodb = app.dataSources.mongodb;
    let User = app.models.user;
    let Team = app.models.Team;
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;
    let needMigrate = false;

    if (!needMigrate) return;

    mongodb.automigrate('User', function (err) {
        User.create([
            { username: 'John', email: 'john@doe.com', password: '123456789' },
            { username: 'Jane', email: 'jane@doe.com', password: '123456789' },
            { username: 'Bob', email: 'bob@projects.com', password: '123456789' }
        ], function (err, users) {
            console.log('created users');

            users[0].projects.create({
                name: 'project1',
                balance: 100
            }, function (err, project) {
                if (err) throw err;

                console.log('Created project:', project);

                // add team members
                Team.create([
                    { ownerId: project.ownerId, memberId: users[0].id },
                    { ownerId: project.ownerId, memberId: users[1].id }
                ], function (err, team) {
                    if (err) throw err;
                    console.log('Created team:', team);
                });
            });

            users[1].projects.create({
                name: 'project2',
                balance: 100
            }, function (err, project) {
                if (err) throw err;

                console.log('Created project:', project);

                //add team members
                Team.create({
                    ownerId: project.ownerId,
                    memberId: users[1].id
                }, function (err, team) {
                    if (err) throw err;

                    console.log('Created team:', team);
                });
            });

            Role.create({
                name: 'admin'
            }, function (err, role) {
                if (err) throw err;

                console.log('Created role:', role);

                //make bob an admin
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: users[2].id
                }, function (err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                });
            });
        })
    });

}