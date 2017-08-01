miz.filter('displayName', function() {
  return function (user) {
    if (!user) {
      return '';
    }

    if (user.profile && user.profile.name) {
      return user.profile.name;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return user;
  }
});