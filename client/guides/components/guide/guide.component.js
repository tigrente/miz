miz.directive("guide", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/guide/guide.ng.html',
      controllerAs: 'gd',
      bindToController: {
        guideId: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            guide: () => {
              return Guides.findOne({
                _id: this.getReactively('guideId')
              });
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('guides');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */

          /* INITIALIZE */

      } // controller
  };  //return
});
