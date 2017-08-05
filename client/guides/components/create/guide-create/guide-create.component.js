miz.directive("guideCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/create/guide-create/guide-create.ng.html',
      controllerAs: 'gc',
      bindToController: {
        room: '<',
        ind: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);
          
          /* HELPERS */
          this.helpers({
            
          });
          
          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* SUBSCRIPTIONS */ 
          
          
          /* FUNCTIONS */
          this.reset = function() {
            this.guide = {
              'cmsType': 'guide',
              'guideType': 'blog', // for now, hard code...
              'publish': 'preview',
              'childrenArticleIds': [],
              'title': '',
              'adminDesc': ''
              // Other data added when inserting into DB
            };
          }

          this.submit = function() {
            this.hide();

            this.call('createGuide', this.guide, (err, data) => {
              if (err) {
                alert('Something went wrong adding a new guide to database: ' + err);
              } else {

                this.call('updateParentGuideRoomWithChildGuideId', data, this.room._id, (err) => {
                  if (err) {
                    alert('Something went wrong trying to update the parent guide room: ' + err);
                  }
                });

              }
            });
          }

          this.hide = function() {
            $('.injected-table-view').eq(this.ind).hide();
          }

          this.canSubmitFn = function() {
            // check that all guides have require properties
            return this.guide.title && this.guide.adminDesc;
          };

          /* INITIALIZE */
          this.guide = {};
          this.reset();

      } // controller
  };  //return
});
