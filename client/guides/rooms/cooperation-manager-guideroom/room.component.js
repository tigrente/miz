miz.directive("cooperationManagerGuideRoom", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/guides/rooms/cooperation-manager-guideroom/room.ng.html',
        controllerAs: 'gc',
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
            this.name = 'Cooperation Manager Guides';
            
        } // controller
  };  //return
});
