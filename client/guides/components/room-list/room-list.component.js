miz.directive("guideRoomList", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room-list/room-list.ng.html',
      controllerAs: 'rl',
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
          

          /* INITIALIZE */

        } // controller
      };  //return
    });
