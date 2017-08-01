Cms = new Mongo.Collection("cms");


//for now - just being logged in should be good enough
Cms.allow({
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