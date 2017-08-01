miz.directive("guideRoom", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room/room.ng.html',
      controllerAs: 'roomCtrl',
      controller: function ($scope, $reactive, $stateParams) {

          $reactive(this).attach($scope);

        
          /* HELPERS */
          this.helpers({
            room: () => {
                return Cms.findOne({
                    _id: $stateParams.roomId
                });
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('cms');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */

          /* INITIALIZE */
          this.guideIndex = 0;

      } // controller
  };  //return
});
