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
            },

            articles: () => {
              this.getReactively('guide');

              if (this.guide) {
                return Articles.find({
                  _id: {
                      $in: this.guide.childrenArticleIds
                  }
                });
              }
            }
          });


          /* SUBSCRIPTIONS */
          this.subscribe('guides');
          this.subscribe('articles');

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

          this.resetNewArticle = function() {
            this.newArticle = {
              'cmsType': 'article',
              'articleType': 'blogWithFiles', // for now, hard code...
              'publish': 'preview',
              'articleImage': null, // for later...
              'files': [], // for later...
              'title': '',
              'body': "<i>This is a auto-generated body stub. Click here to edit!</i>"
              // Other data added when inserting into DB
            };
          }

          this.addNewArticle = function() {
            this.resetNewArticle();

            $('#new-articles').append(
              $compile(`
                <tr>
                <td> <a href="#" editable-text="ga.newArticle.title" e-label="Article Title">{{ ga.newArticle.title || 'Article Name' }}</a> </td>
                <td> - </td>
                <td> - </td>
                <td> 
                  <a href="#" editable-select="ga.newArticle.publish" e-ng-options="s.value as s.text for s in ga.xEditableVisStatuses" buttons="no">
                    {{ ga.showXEditableVisStatus(ga.newArticle) }}
                  </a>
                </td>
                <td> <button type="button" class="btn btn-primary" ng-click="ga.submitNewArticle($event)" ng-disabled="!ga.canSubmitNewArticleFn()">Save</button> </td>
                <td> <i class="fa fa-arrow-up" aria-hidden="true"></i> </td>       
                <td> <i class="fa fa-arrow-down" aria-hidden="true"></i> </td>      
                <td> <i class="fa fa-times remove" aria-hidden="true" style="color:red;cursor:pointer" ng-click="ga.removeNewArticle($event)"></i> </td>
                </tr>
              `)($scope)
            );
          }

          this.canAddNewArticle = function() {
            this.getReactively('newArticle');
            return _.size(this.newArticle) !== 0;
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

        this.editArticle = function(articleId) {
          window.location.href = '/article/' + articleId + '/edit';
        }

        this.deleteArticle = function() {
          if (this.articleIdToDelete !== -1) {
            this.call('deleteArticle', this.articleIdToDelete, (err) => {
              if (err) {
                alert('Something went wrong deleting an article: ' + err);
              }
            });
            
            this.call('updateParentGuideWithDeletedChildArticleId', this.articleIdToDelete, $stateParams.guideId, (err) => {
              if (err) {
                alert('Something went wrong trying to update the parent guide: ' + err);
              }
            });
          } else {
            alert('article ID not found, cannot delete. Reseting article ID.');
          }

          this.articleIdToDelete = -1;
        }

        this.submitNewArticle = function($event) {
          this.call('createArticle', this.newArticle, (err, data) => {
            if (err) {
              alert('Something went wrong adding a new article to database: ' + err);
            } else {
              this.call('updateParentGuideWithChildArticleId', data, this.guide._id, (err) => {
                if (err) {
                  alert('Something went wrong trying to update the parent guide room: ' + err);
                }
              });
            }
          });

          this.removeNewArticle($event);
        }

        this.removeNewArticle = function($event) {
          $event.target.closest('tr').remove();
          this.newArticle = {};
        }

        this.canSubmitNewArticleFn = function() {
          // check that article has require properties
          return this.newArticle.title && this.newArticle.body;
        };

        this.showXEditableVisStatus = function(article) {
          this.getReactively('article');

          if (article) {
            selected = _.where(this.xEditableVisStatuses, { value: article.publish });
            return (article.publish && selected.length) ? selected[0].text : 'Not set';
          }
          return 'Not set';
        }

        /* INITIALIZE */
        this.guideChanged = false;
        this.articleIdToDelete = -1;

        this.newArticle = {};
        this.xEditableVisStatuses = [
          { value: 'publish', text: 'Publish'},
          { value: 'preview', text: 'Preview'},
          { value: 'hide', text: 'Hide'}
        ]

      } // controller
  };  //return
});
