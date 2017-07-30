Meteor.publish("guideRooms", function() {
  return guideRooms.find({});
});