miz.directive("articlesList", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/articles/articles-list/articles-list.ng.html',
      controllerAs: 'artcLst',
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);


          /* HELPERS */

          this.helpers({
            //   articles: () => {}
          });


          /* SUBSCRIPTIONS */


          /* AUTORUN */
          this.autorun(() => {


          }); //autorun

          /* FUNCTIONS */


          /* INITIALIZE */


      } // controller
  };  //return
});
