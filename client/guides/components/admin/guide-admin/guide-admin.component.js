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
          this.update = function() {
            console.log(this.guide);
            this.call('updateGuide', $stateParams.guideId, this.guide,
              (err) => {
                if (err) {
                  alert('Something went wrong updating the guide: ' + err);
                } else {
                  alert('Guide updated');
                }
              });
          }

          this.addNewArticle = function() {
            $('#new-articles').append(
              $compile("<article-create guide='ga.guide'></article-create>")($scope)
            );
          }

          /* INITIALIZE */

      } // controller
  };  //return
});
