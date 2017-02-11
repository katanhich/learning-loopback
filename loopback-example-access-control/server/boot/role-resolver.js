// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

var AccessContext = require('loopback/lib/access-context').AccessContext;
var async = require('async');

module.exports = function(app) {
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  // override this function just for mongodb
  Role.isInRole = function (role, context, callback) {
        if (!(context instanceof AccessContext)) {
            context = new AccessContext(context);
        }

        this.resolveRelatedModels();

        context.debug();

        var resolver = Role.resolvers[role];
        if (resolver) {
            var promise = resolver(role, context, callback);
            if (promise && typeof promise.then === 'function') {
                promise.then(
                    function (result) { callback(null, result); },
                    callback
                );
            }
            return;
        }

        if (context.principals.length === 0) {
            process.nextTick(function () {
                if (callback) callback(null, false);
            });
            return;
        }

        var inRole = context.principals.some(function (p) {
            var principalType = p.type || undefined;
            var principalId = p.id || undefined;

            // Check if it's the same role
            return principalType === RoleMapping.ROLE && principalId === role;
        });

        if (inRole) {
            process.nextTick(function () {
                if (callback) callback(null, true);
            });
            return;
        }
        
        var roleMappingModel = this.roleMappingModel;
        this.findOne({ where: { name: role } }, function (err, result) {
            if (err) {
                if (callback) callback(err);
                return;
            }
            if (!result) {
                if (callback) callback(null, false);
                return;
            }

            // Iterate through the list of principals
            async.some(context.principals, function (p, done) {
                var principalType = p.type || undefined;
                var principalId = p.id || undefined;
                var roleId = result.id.toString();
                var principalIdIsString = typeof principalId === 'string';

                if (principalId !== null && principalId !== undefined && !principalIdIsString) {
                    principalId = principalId.toString();
                }

                if (principalType && principalId) {
                    var ds = RoleMapping.app.dataSources.mongodb;
                    ds.connector.collection('RoleMapping').findOne({
                        'roleId': result.id,
                        'principalType': principalType,
                        'principalId': principalId
                    }, function(err,cursor){
                        done(!err && cursor); // The only arg is the result
                    });
                } else {
                    process.nextTick(function () {
                        done(false);
                    });
                }
            }, function (inRole) {
                if (callback) callback(null, inRole);
            });
        });
    };

  Role.registerResolver('teamMember', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'project') {
      return reject();
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    console.log(context.modelId)

    // check if userId is in team table for the given project id
    context.model.findById(context.modelId, function(err, project) {
      if (err || !project)
        return reject();

      var Team = app.models.Team;
      Team.count({
        ownerId: project.ownerId,
        memberId: userId
      }, function(err, count) {
        if (err) {
          console.log(err);
          return cb(null, false);
        }

        console.log(err, count)

        cb(null, count > 0); // true = is a team member
      });
    });
  });
};