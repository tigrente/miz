Partners = new Mongo.Collection("partners");


//for now - just being logged in should be good enough
Partners.allow({
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
