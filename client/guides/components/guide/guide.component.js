miz.directive("guide", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/guide/guide.ng.html',
      controllerAs: 'gd',
      bindToController: {
        guide: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          /* SUBSCRIPTIONS */


          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.getUser = function (userId) {
            return Meteor.users.findOne({
              _id: userId
            });
          }

          /* INITIALIZE */
          this.panelOpen = false;

      } // controller
  };  //return
});
