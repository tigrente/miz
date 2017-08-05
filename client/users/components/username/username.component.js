miz.directive("username", function () {
  return {
      restrict: 'E',
      template: '{{ un.user | vxZ4DfS2TREwq2displayName }}',
      controllerAs: 'un',
      bindToController: {
        userId: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            user: () => {
              return Meteor.users.findOne({
                _id: this.getReactively('userId')
              });
            } 
          });

          /* AUTORUN */
          this.autorun(() => {

          });

          /* SUBSCRIPTIONS */
          this.subscribe('users');

          /* INITIALIZE */

      } // controller
  };  //return
});


miz.filter('vxZ4DfS2TREwq2displayName', () => {
  return function (user) {
    if (!user) {
      return '?';
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