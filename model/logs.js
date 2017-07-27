/**
 * Logs - the user entry logs for each engagement and or company.  Not to be confused with Logs
 */

Logs = new Mongo.Collection("logs");


//for now - just being logged in should be good enough
Logs.allow({
    insert: function(userId) {
        return userId;
    },
    update: function(userId) {
        return userId;
    },
    remove: function(userId) {
        return userId;
    }
});