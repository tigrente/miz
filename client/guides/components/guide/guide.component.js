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
          // this.subscribe('cms');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */

          /* INITIALIZE */
          this.panelOpen = false;

      } // controller
  };  //return
});
