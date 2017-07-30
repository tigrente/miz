miz.directive("guideRoom", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/rooms/room.ng.html',
      controllerAs: 'room',
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

          /* INITIALIZE */


      } // controller
  };  //return
});
