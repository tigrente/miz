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
            },
            editedGuide: () => {
              this.getReactively('guide');
              return _.clone(this.guide);
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('guides');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.update = function() {
            this.call('updateGuide', $stateParams.guideId, this.editedGuide,
              (err) => {
                if (err) {
                  alert('Something went wrong updating the guide: ' + err);
                } else {
                  alert('Guide updated');
                }
              });

            this.reset();
          }

          this.addNewArticle = function() {
            $('#new-articles').append(
              $compile("<article-create guide='ga.guide'></article-create>")($scope)
            );
          }

          this.reset = function() {
            this.guideChanged = false;
            this.editedGuide = _.clone(this.guide);
          }

          this.canSaveData = function() {
            if (this.editedGuide)
              return this.editedGuide.title && this.editedGuide.adminDesc;
          }

          this.isEditingGuide = function() {
            return this.guideChanged || false;
        }

        /* INITIALIZE */
        this.guideChanged = false;

      } // controller
  };  //return
});
