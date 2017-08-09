miz.directive("articleEdit", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/article-edit/article-edit.ng.html',
      controllerAs: 'ae',
      bindToController: {
        guide: '<'
      },
      controller: function ($scope, $reactive, $stateParams) {

        $reactive(this).attach($scope);

        /* HELPERS */
        this.helpers({
          article: () => {
            return Articles.findOne({
              _id: $stateParams.articleId
            })
          },

          editedArticle: () => {
            this.getReactively('article');
            return _.clone(this.article);
          }
        });


        /* SUBSCRIPTIONS */
        this.subscribe('articlesAll');

        /* AUTORUN*/
        this.autorun(() => {

        }); //autorun

        /* FUNCTIONS */
        this.update = function () {

          this.call('updateArticle', $stateParams.articleId, this.editedArticle,
            (err, data) => {
              if (err) {
                alert('Something went wrong updating the article: ' + err);
              }
          });

          this.reset();
        }

        this.editBody = function() {
          this.bodyChanged = true;
        }
        
        this.isEditingBody = function() {
            return this.bodyChanged || false;
        }

        this.isEditingArticle = function() {
            return (this.articleChanged || this.bodyChanged) || false;
        }

        this.reset = function() {
          this.bodyChanged = false;
          this.articleChanged = false;
          this.editedArticle = _.clone(this.article);
        }

        this.showXEditableVisStatus = function() {
          if (this.editedArticle) {
            selected = _.where(this.xEditableVisStatuses, { value: this.editedArticle.publish });
            return (this.editedArticle.publish && selected.length) ? selected[0].text : 'Not set';
          }
          return 'Not set';
        }

        this.canSaveData = function() {
          return this.editedArticle.title && this.editedArticle.body;
        }

        /* INITIALIZE */
        this.articleChanged = false;
        this.bodyChanged = false;
        this.editedArticle = {};

        this.xEditableVisStatuses = [
          { value: 'publish', text: 'Publish'},
          { value: 'preview', text: 'Preview'},
          { value: 'hide', text: 'Hide'}
        ]

        //froala WYSIWYG options
        $.FroalaEditor.DEFAULTS.key = 'evjavgjH3fij==';

        this.froalaOptions = {
          toolbarButtons: [
            // 'fullscreen',
            'bold',
            'italic',
            'underline',
            // 'strikeThrough',
            // 'subscript',
            // 'superscript',
            // 'fontFamily',
            // 'fontSize',
            // '|',
            'color',
            // 'emoticons',
            // 'inlineStyle',
            // 'paragraphStyle',
            '|',
            'paragraphFormat',
            // 'align',
            'formatOL',
            'formatUL',
            //'outdent',
            //'indent',
            // 'quote',
            // 'insertHR',
            // '-',  // starts a new row of buttons
            'insertLink',
            // 'insertImage',
            // 'insertVideo',
            // 'insertFile',
            'insertTable',
            'undo',
            'redo',
            'clearFormatting',
            // 'selectAll',
            // 'html'
          ],

          toolbarButtonsMD: [
            'bold',
            'italic',
            'underline',
            'color',
            '|',
            'paragraphFormat',
            'formatOL',
            'formatUL',
            'insertLink',
            'insertTable',
            'undo',
            'redo',
            'clearFormatting',
          ],


          /* quickInsertButtons: [  // quick upload buttons plugin not included below
            // 'image',
            'table',
            'ul',
            'ol',
            'hr'],*/

            //todo: revisit to enable images in Froala
            pluginsEnabled: [  // plug-ins- file uploading and images currently discabled
              'align',
              'colors',
              'entities',
              'font_family',
              'font_size',
              'inline_style',
              'line_breaker',
              'link',
              'lists',
              'paragraph_format',
              'paragraph_style',
              'quote',
              'table',
              'url',
              // 'image',
              // 'draggable'
            ],

            imageUploadURL: '/upload_image',

            charCounterCount: false,  // Disable the character counter

            imageUpload: true, // disable uploading of images
            imagePaste: true   // disable uploading of files
            /*["bold", "italic", "underline", "sep", "align", "insertOrderedList", "insertUnorderedList"]*/
          };
      } // controller
  };//return
});
