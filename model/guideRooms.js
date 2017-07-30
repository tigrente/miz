guideRooms = new Mongo.Collection("guide_rooms");


//for now - just being logged in should be good enough
guideRooms.allow({
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