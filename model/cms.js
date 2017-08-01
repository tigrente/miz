Cms = new Mongo.Collection("cms");
Guides = new Mongo.Collection("guides");
Articles = new Mongo.Collection("articles");


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

//for now - just being logged in should be good enough
Guides.allow({
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

//for now - just being logged in should be good enough
Articles.allow({
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