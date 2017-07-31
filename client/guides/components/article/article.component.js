miz.directive("article", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/article/article.ng.html',
      controllerAs: 'artcCtrl',
      bindToController: {
        article: '<'
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
