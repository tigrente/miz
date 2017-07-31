Meteor.publish('cms', function() {
  return cms.find({
    cmsType: 'room'
  });
});