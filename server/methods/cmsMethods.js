Meteor.publish('guideRooms', function() {
  return cms.find({
    cmsType: 'rooms'
  });
});

Meteor.publish('guides', function() {
  return cms.find({
    cmsType: 'guides'
  });
});

Meteor.publish('articles', function() {
  return cms.find({
    cmsType: 'articles'
  });
});