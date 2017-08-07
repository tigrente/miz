miz.directive("guideAdmin", function ($compile) {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/admin/guide-admin/guide-admin.ng.html',
      controllerAs: 'ga',
      controller: function ($scope, $reactive, $stateParams) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            guide: () => {
              return Guides.findOne({
                _id: $stateParams.guideId
              });
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('guides');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.addNewArticle = function() {
            $('#new-articles').append(
              $compile("<article-create guide='ga.guide'></article-create>")($scope)
            );
          }

          /* INITIALIZE */

      } // controller
  };  //return
});