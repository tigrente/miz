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
          this.subscribe('guidesAll');
          this.subscribe('articlesAll');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.updateGuide = function() {
            this.call('updateGuide', $stateParams.guideId, this.guide,
              (err) => {
                if (err) {
                  alert('Something went wrong updating the guide: ' + err);
                }
              });
          }

          this.updateArticle = function(article) {
            this.call('updateArticle', article._id, article,
              (err) => {
                if (err) {
                  alert('Something went wrong updating the article: ' + err);
                }
              });
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

        this.addNewArticle = function() {
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
        }

        this.showXEditableVisStatus = function(article) {
          this.getReactively('article');

          if (article) {
            selected = _.where(this.xEditableVisStatuses, { value: article.publish });
            return (article.publish && selected.length) ? selected[0].text : 'Not set';
          }
          return 'Not set';
        }

        /* INITIALIZE */
        this.articleIdToDelete = -1;

        this.newArticle = {
          'cmsType': 'article',
          'articleType': 'blogWithFiles', // for now, hard code...
          'publish': 'preview',
          'articleImage': null, // for later...
          'files': [], // for later...
          'title': 'New Article',
          'body': "<i>This is a auto-generated body stub. Click here to edit!</i>"
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
