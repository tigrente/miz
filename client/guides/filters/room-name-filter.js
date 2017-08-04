miz.filter('guideName', function() {
  return function (guideId) {
    guide = Guides.findOne({
      _id: guideId
    });
    
    if (!guideId) {
      return '?';
    }

    if (guide) {
      return guide.title;
    }

    return guideId;
  }
});