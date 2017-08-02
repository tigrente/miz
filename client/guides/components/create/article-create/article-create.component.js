miz.directive("articleCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/create/article-create/article-create.ng.html',
      controllerAs: 'ac',
      bindToController: {
        articles: '='
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          /* SUBSCRIPTIONS */ 
          
          
          /* FUNCTIONS */
          this.addToArticles = function() {
            this.articles.push(this.article);
            this.reset();
          }
          
          this.reset = function() {
            this.article = {
              'cmsType': 'article',
              'articleType': 'blogWithFiles', // for now, hard code...
              'publish': true, // for now hard code ...
              'hidden': false, // for now, hard code ...
              'articleImage': null, // for later...
              'files': [], // for later...
              'title': '',
              'body': ''
              // Other data added when inserting into DB
            };
          }
          
          /* INITIALIZE */
          this.article = {};
          this.reset();
          
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
            
            /* AUTORUN*/
            this.autorun(() => {
                this.addToArticles(); // Automatically open container
            }); //autorun
            
          } // controller
        };  //return
      });
      