miz.directive("guideRoomAdmin", function ($compile) {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/admin/room-admin/room-admin.ng.html',
      controllerAs: 'ra',
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            rooms: () => {
              return Cms.find({});
            },

            currentRoom: () => {
              return Cms.findOne();
            },

            guides: () => {
              this.getReactively('currentRoom');

              if (this.currentRoom && this.currentRoom.childrenGuideIds) {
                return Guides.find({
                  _id: {
                      $in: this.currentRoom.childrenGuideIds
                  }
                });
              }
            }
          });
          
          
          /* SUBSCRIPTIONS */
          this.subscribe('cms');
          this.subscribe('guidesAll');
          
          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun
          
          /* FUNCTIONS */
          this.updateRoomDescription = function(data) {
            if (data.adminDesc !== this.currentRoom.adminDesc) {
              this.call('updateGuideRoomDescription', this.currentRoom._id, data, (err) => {
                if (err) {
                  alert('Something went wrong adding updating the guide room description: ' + err);
                }
              });
            }
          }

          this.updateGuide = function(guide) {
            this.call('updateGuide', guide._id, guide,
              (err) => {
                if (err) {
                  alert('Something went wrong updating the guide: ' + err);
                }
              });
          }

          this.resetNewGuide = function() {
            this.newGuide = {
              'cmsType': 'guide',
              'guideType': 'blog', // for now, hard code...
              'publish': 'preview',
              'childrenArticleIds': [],
              'title': '',
              'adminDesc': ''
              // Other data added when inserting into DB
            };
          }

          this.addNewGuide = function() {
            this.resetNewGuide();
            
            $('#new-guides').append(
              $compile(`
              <tr class="injected-table-view">
                <td class="gr-table-row"> <a href="#" editable-text="ra.newGuide.title" e-label="Guide Title">{{ ra.newGuide.title || 'Guide Name' }}</a> </td>
                <td class="gr-table-row"> <a href="#" editable-text="ra.newGuide.adminDesc" e-label="Guide Description">{{ ra.newGuide.adminDesc || 'Guide Description' }}</a> </td>
                <td class="gr-table-row"> 
                  <a href="#" editable-select="ra.newGuide.publish" e-ng-options="s.value as s.text for s in ra.xEditableVisStatuses" buttons="no">
                    {{ ra.showXEditableVisStatus(ra.newGuide) }}
                  </a>
                </td>
                <td class="gr-table-row"> - </td>
                <td class="gr-table-row"> <button type="button" class="btn btn-primary" ng-click="ra.submitNewGuide($event)" ng-disabled="!ra.canSubmitNewGuideFn()">Save</button> </td> 
                <td class="gr-table-row"> - </td>
                <td class="gr-table-row"> - </td>
                <td class="gr-table-row"> <i class="fa fa-times" aria-hidden="true" style="color:red;cursor:pointer" ng-click="ra.removeNewGuide($event)"></i> </td>
              </tr>`
              )($scope)
            );
          }

          this.canAddNewGuide = function() {
            this.getReactively('newGuide');
            return _.size(this.newGuide) !== 0;
          }

          this.editGuide = function(guideId) {
            window.location.href = '/guide/' + guideId + '/admin';
          }
          
          this.deleteGuide = function() {
            if (this.guideIdToDelete !== -1) {
              this.call('deleteGuide', this.guideIdToDelete, (err) => {
                if (err) {
                  alert('Something went wrong deleting a guide: ' + err);
                }
              });
              
              this.call('updateParentGuideRoomWithDeletedChildGuideId', this.guideIdToDelete, this.currentRoom._id, (err) => {
                if (err) {
                  alert('Something went wrong trying to update the parent guide room: ' + err);
                }
              });
            } else {
              alert('guide ID not found, cannot delete. Reseting guide ID.');
            }

            this.guideIdToDelete = -1;
          }
 
          this.submitNewGuide = function($event) {
            this.call('createGuide', this.newGuide, (err, data) => {
              if (err) {
                alert('Something went wrong adding a new guide to database: ' + err);
              } else {
                this.call('updateParentGuideRoomWithChildGuideId', data, this.currentRoom._id, (err) => {
                  if (err) {
                    alert('Something went wrong trying to update the parent guide room: ' + err);
                  }
                });
              }
            });

            this.removeNewGuide($event);
          }

          this.removeNewGuide = function($event) {
            $event.target.closest('tr').remove();
            this.newGuide = {};
          }

          this.canSubmitNewGuideFn = function() {
            // check that guide has require properties
            return this.newGuide.title && this.newGuide.adminDesc;
          };

          this.showXEditableVisStatus = function(guide) {
            if (guide) {
              selected = _.where(this.xEditableVisStatuses, { value: guide.publish });
              return (guide.publish && selected.length) ? selected[0].text : 'Not set';
            }
            return 'Not set';
          }

          /* INITIALIZE */
          this.guideIdToDelete = -1;

          this.newGuide = {};
          this.xEditableVisStatuses = [
            { value: 'publish', text: 'Publish'},
            { value: 'preview', text: 'Preview'},
            { value: 'hide', text: 'Hide'}
          ]

      } // controller
  };  //return
});
