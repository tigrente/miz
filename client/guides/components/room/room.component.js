miz.directive("guideRoom", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room/room.ng.html',
      controllerAs: 'roomCtrl',
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

        
          /* HELPERS */
          this.helpers({
            room: () => {
                return cms.findOne(); // for now just get the first entry
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('cms');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */

          /* INITIALIZE */

      } // controller
  };  //return
});
