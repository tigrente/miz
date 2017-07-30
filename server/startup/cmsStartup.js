// Creates rooms

Meteor.startup(function() {
  if (cms.find().count() === 0) {
    // example \/
    const articles = [{
      'title': 'Article 1',
      'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mollis maximus ex ultrices iaculis. Mauris id rutrum risus.',
      'cmsType': 'article'
    }];

    const guides = [{
      'title': 'Guide 0',
      'articles': articles,
      'cmsType': 'guide'
    }];


    const rooms = [{
      'name': 'Cooperation Manager Guides',
      'guides': guides,
      'cmsType': 'room'
    }];

    rooms.forEach((element) => {
      cms.insert(element)
    });
  }
});