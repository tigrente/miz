miz.directive("guideInfo", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room-admin/guide-info/guide-info.ng.html',
      controllerAs: 'ge',
      bindToController: {
        guideId: '<',
        roomId: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            guide: () => {
              return Guides.findOne({
                _id: this.guideId
              });
            }
          });


          /* SUBSCRIPTIONS */ 
          this.subscribe('guides');
          
          /* FUNCTIONS */

          /* INITIALIZE */
          this.editGuide = function() {
            console.log('Editing guide..')
          }

          this.delete = function() {
            this.call('deleteGuide', this.guideId, (err, data) => {
              if (err) {
                alert('Something went wrong deleting a guide: ' + err);
              } else {
                
              }
            });

            this.call('updateParentGuideRoomWithDeletedChildGuideId', this.guideId, this.roomId, (err) => {
              if (err) {
                alert('Something went wrong trying to update the parent guide room: ' + err);
              }
            });
          }

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun


      } // controller
  };  //return
});
