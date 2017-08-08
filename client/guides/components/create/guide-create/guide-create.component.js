miz.directive("guideCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/create/guide-create/guide-create.ng.html',
      controllerAs: 'gc',
      bindToController: {
        room: '<'
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
          this.submit = function($event) {
            this.remove($event);

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

          this.remove = function($event) {
            $event.target.closest('tr').remove();
          }

          this.canSubmitFn = function() {
            // check that all guides have require properties
            return this.guide.title && this.guide.adminDesc;
          };

          this.showXEditableVisStatus = function() {
            selected = _.where(this.xEditableVisStatuses, { value: this.guide.publish });
            return (this.guide.publish && selected.length) ? selected[0].text : 'Not set';
          }

          /* INITIALIZE */
          this.guide = {
            'cmsType': 'guide',
            'guideType': 'blog', // for now, hard code...
            'publish': 'preview',
            'childrenArticleIds': [],
            'title': '',
            'adminDesc': ''
            // Other data added when inserting into DB
          };

          this.xEditableVisStatuses = [
            { value: 'publish', text: 'Publish'},
            { value: 'preview', text: 'Preview'},
            { value: 'hide', text: 'Hide'}
          ]

      } // controller
  };  //return
});
