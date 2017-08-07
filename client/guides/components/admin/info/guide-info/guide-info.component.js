miz.directive("guideInfo", function () {
  return {
    restrict: 'E',
    templateUrl: 'client/guides/components/admin/info/guide-info/guide-info.ng.html',
    controllerAs: 'gi',
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
      
      /* AUTORUN*/
      this.autorun(() => {

      }); //autorun

      /* SUBSCRIPTIONS */ 
      this.subscribe('guides');
      
      /* FUNCTIONS */

      this.editGuide = function() {
        window.location.href = '/guide/' + this.guideId + '/admin';
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
        
      /* INITIALIZE */

    } // controller
  };  //return
});
