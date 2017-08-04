miz.directive("guideRoomAdmin", function ($compile) {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room-admin/room-admin.ng.html',
      controllerAs: 'ra',
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            rooms: () => {
              return Cms.find({});
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('cms');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.deleteNewGuide = function(ind) {
            console.log('delete', ind);
          }

          this.incNewGuides = function() {
            this.newGuides++;
          }

          /* INITIALIZE */
          this.newGuides = 0;
          this.room = {};

      } // controller
  };  //return
});
