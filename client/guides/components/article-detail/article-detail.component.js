miz.directive("articleDetail", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/article-detail/article-detail.ng.html',
      controllerAs: 'ad',
      controller: function ($scope, $reactive, $stateParams) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            article: () => {
              return Articles.findOne({
                _id: $stateParams.articleId
              })
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('articles');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */

          /* INITIALIZE */

      } // controller
  };  //return
});
