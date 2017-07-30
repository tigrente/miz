miz.directive("articleDetail", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/articles/articles-list/articles-list.ng.html',
      controllerAs: 'artcDtl',
      controller: function ($stateParams, $scope, $reactive) {

          $reactive(this).attach($scope);


          /* HELPERS */

          this.helpers({
              article: () => {
                Articles.findOne({
                  _id: $stateParams.articleId
                });
              }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('articles');

          /* AUTORUN */
          this.autorun(() => {


          }); //autorun

          /* FUNCTIONS */


          /* INITIALIZE */


      } // controller
  };  //return
});
