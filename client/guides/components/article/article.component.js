miz.directive("article", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/article/article.ng.html',
      controllerAs: 'ar',
      bindToController: {
        articleId: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            article: () => {
              return Articles.findOne({
                _id: this.getReactively('articleId')
              })
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('articles');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.view = function() {
            window.location.href += '/article/' + this.articleId;
          }

          /* INITIALIZE */

      } // controller
  };  //return
});