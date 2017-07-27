Engagements = new Mongo.Collection("engagements");


//for now - just being logged in should be good enough
Engagements.allow({
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

//todo: ensure that engagements are updated as permitted by owner

