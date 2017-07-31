miz.directive("guide", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/guide/guide.ng.html',
      controllerAs: 'guideCtrl',
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

      } // controller
  };  //return
});
