Backups = new Mongo.Collection("backups");


//for now - just being logged in should be good enough
Backups.allow({
    insert: function(userId) {
        return Roles.userIsInRole(userId, 'superAdmin');
    },
    update: function(userId) {
        return Roles.userIsInRole(userId, 'superAdmin');
    },
    remove: function(userId) {
        return Roles.userIsInRole(userId, 'superAdmin');
    }
});