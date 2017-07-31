miz.directive("guideRoom", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room/room.ng.html',
      controllerAs: 'roomCtrl',
      controller: function ($scope, $reactive, $stateParams) {

          $reactive(this).attach($scope);

          roomId = $stateParams.roomId;
        
          /* HELPERS */
          this.helpers({
            room: () => {
                return cms.findOne({
                    _id: roomId
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

      } // controller
  };  //return
});
