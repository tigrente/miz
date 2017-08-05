miz.directive("guideRoom", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room/room.ng.html',
      controllerAs: 'rc',
      bindToController: {
        roomName: '@'
      },
      controller: function ($scope, $reactive) {

        $reactive(this).attach($scope);
        
        
        /* HELPERS */
        this.helpers({
            room: () => {
                return Cms.findOne({
                    name: this.getReactively('roomName')
                });
            }
        });
            
        /* SUBSCRIPTIONS */
        this.subscribe('cms');
        
        /* AUTORUN*/
        this.autorun(() => {
            
        }); //autorun
        
        /* FUNCTIONS */
        this.setGuideId = function(guideId) {
            this.guideId = guideId;
        }
        
        /* INITIALIZE */
        this.guideId = '';

      } // controller
  };  //return
});
