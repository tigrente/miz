miz.directive("guideEdit", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room-admin/guide-info/guide-info.ng.html',
      controllerAs: 'ge',
      bindToController: {
        guide: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          /* SUBSCRIPTIONS */ 
          this.subscribe('guides');
          
          /* FUNCTIONS */
          this.save = function () {
            this.call('', )
          }

          /* INITIALIZE */
          
          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun


      } // controller
  };  //return
});
