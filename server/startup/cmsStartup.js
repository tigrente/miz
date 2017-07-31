// Creates rooms

Meteor.startup(function() {
  if (cms.find().count() === 0) {
    // example \/
    const articles = [{
      'title': 'Article 1',
      'body': `       
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vulputate venenatis auctor. Mauris semper, nisl sit amet faucibus tincidunt, enim sem pretium libero, sit amet ultrices leo nisi eu odio. Duis risus massa, mattis ac lacus id, molestie congue quam. Sed augue turpis, porta in fermentum et, egestas id dui. Aenean maximus id nulla maximus aliquet. Morbi tristique in risus id efficitur. In a dolor sed turpis tincidunt vulputate nec ac diam. Morbi luctus purus at dapibus lacinia. Morbi sit amet malesuada tellus. Vestibulum semper turpis purus, in iaculis eros faucibus at. Ut consectetur imperdiet nulla a consequat. Suspendisse volutpat ex vel erat volutpat, sit amet elementum elit facilisis. Phasellus semper hendrerit ex, sit amet pretium augue.

          Quisque venenatis tempus dui, sed dignissim est porttitor at. Donec lobortis mi quis tortor accumsan, sed vestibulum nisi aliquet. Vivamus ut est et dui ullamcorper placerat. Phasellus facilisis mollis ex a viverra. Mauris eros arcu, tempor at tortor eget, bibendum tempor dui. Praesent placerat odio vel placerat accumsan. Aliquam rhoncus metus ac sapien euismod, nec eleifend urna sollicitudin.

          Phasellus mi felis, ornare eu ipsum ut, volutpat interdum sapien. Sed at ex sit amet justo rhoncus iaculis. Phasellus eget risus in metus lacinia blandit eget semper nibh. Phasellus id nibh scelerisque, fermentum eros ut, luctus urna. Proin porttitor lorem risus, non egestas lorem placerat non. Nulla facilisi. Duis varius viverra sem, in interdum quam molestie ut.

          Donec rutrum ante vitae ante viverra faucibus. Duis laoreet justo est, id tempor mi fermentum quis. Phasellus pharetra nisi a feugiat cursus. Nullam malesuada bibendum dui eget semper. Integer bibendum lacus non leo iaculis lacinia. Duis turpis justo, lobortis eu tempor a, congue non dui. Fusce semper luctus lectus eget posuere. Pellentesque leo mauris, vehicula nec odio sit amet, auctor fringilla lacus. Etiam eget dignissim nisl. Curabitur a dolor at est tempor venenatis a ut leo. Proin ante augue, egestas eget quam vel, elementum finibus tellus. Nulla euismod bibendum lacus ac mollis. Nunc euismod ligula quis nisl lacinia rhoncus. In elementum iaculis libero at faucibus. In ac massa interdum, sagittis orci quis, hendrerit ex.

          Mauris ut lectus risus. Suspendisse pharetra tortor at lorem tempor, ut vestibulum nisl blandit. Nulla eget porta augue, eu facilisis nibh. Cras nec nibh blandit, placerat enim in, accumsan purus. Mauris vel nulla id ipsum pharetra dictum. Donec ut porttitor justo. Morbi ac imperdiet erat. Sed consectetur felis turpis, in pretium neque viverra vel. Integer mauris purus, tincidunt in nibh nec, imperdiet suscipit arcu. Fusce egestas mauris dui, vitae sollicitudin purus lobortis ac. Suspendisse congue sem eros, maximus aliquam nisl consequat eget. Suspendisse potenti. Aliquam lacus velit, ornare eget nunc vel, tristique porttitor diam.`,
      'author': 'God',
      'modifiedDate': new Date(86400000), // Jan 1 1970
      'modifiedBy': 'Alex',
      'cmsType': 'article'
    }];

    const guides = [{
      'title': 'Guide 0',
      // 'articles': articles,
      'cmsType': 'guide'
    },
  
    {
      'title': 'Guide 1',
      'articles': articles,
      'cmsType': 'guide'
    }];


    const rooms = [{
      'name': 'Cooperation Manager Guides',
      'guides': guides,
      'adminDesc': 'A room for Cooperation Management',
      'modifiedDate': new Date(86400000), // Jan 1 1970
      'modifiedBy': 'Alex',
      'cmsType': 'room'
    }];

    rooms.forEach((element) => {
      cms.insert(element)
    });
  }
});