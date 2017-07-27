/**
 * Created by Alex on 10/7/15.
 */

angular.module("miz").controller("PartnerDetailsCtrl", ['$scope', '$stateParams', '$meteor', '$state', '$reactive',
    function ($scope, $stateParams, $meteor, $reactive) {


        $scope.partner = $meteor.object(Partners, $stateParams.partnerId).subscribe('partnerDetail');
        $scope.partnerId = $scope.partner._id;







        $scope.parentName = function () {
            var parentObject = $meteor.object(Partners, this.parent).subscribe('partnerDetail');
            return parentObject.name;
        };


        $scope.subscribe('images');

        $meteor.autorun($scope, function () {
            /*** This section retreives the logo from the image database ***/
            $scope.logo = Images.findOne({_id: $scope.getReactively("partner.logo")});

            //if there is no image, load a default image for the partnertype
            //default images are loaded in the startup script and must be updated in the image database
            if ($scope.logo == null) {
                $scope.logo = Images.findOne({mizSystemReference: $scope.partner.partnerType});
            }


            /*** This section builds the partner list for parent selection ***/
            // if there's nothing in the search field, don't show any records
            if ($scope.getReactively('parentSearch') && $scope.getReactively('parentSearch')) {
                $scope.$meteorSubscribe('partnerList',
                    {
                        limit: 5
                    },

                    $scope.getReactively('parentSearch')
                );
            }


            /*** This section builds the user list for owner selection ***/
            // note that the current user will always appear - it's loaded from the user collection
            if ($scope.getReactively('bizDevOwnerSearch') && $scope.getReactively('bizDevOwnerSearch')) {
                $meteor.subscribe('userList',
                    {
                        limit: 5
                    },

                    $scope.getReactively('bizDevOwnerSearch'), "editEngagements"
                );
            }

            /*** This section builds the link in the image update modal ***/
            $scope.googleImgLink = function () {
                var link;
                link = "http://www.google.com/search?q=" + $scope.newPartner.name + "&tbm=isch";
                return link;
            };

        });

        /***************************************************************************************************
         * logoDropzoneOptions
         * Options for the logo/photo insertion drop zone
         ****************************************************************************************************/

            // CollectionFS collection
        $scope.images = $meteor.collectionFS(Images, false, Images).subscribe('images');


        $scope.logoDropzoneOptions = {
            acceptedFiles: 'image/*',
            maxFilesize: 5,
            uploadMultiple: false,
            addRemoveLinks: true,
            maxFiles: 1,


            // The setting up of the dropzone
            init: function () {
                $scope.myDropzone = this;

                // First change the button to actually tell Dropzone to process the queue.

                // Limit the number of uploaded logos to just one.
                this.on("addedfile", function () {
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                });


            },

            accept: function (file, done) {
                $(".dz-progress").remove();  // hiding progress bar
                $scope.logoObj = new FS.File(file);
                $scope.logoObj.owner = Meteor.userId();
                $scope.logoObj.createdBy = Meteor.userId();


                Images.insert($scope.logoObj, function (err, fileObj) {
                    if (err) {
                        // handle error
                    } else {
                        // handle success depending what you need to do
                        $scope.partner.logo = fileObj._id;

                    }

                })

            },

            dictDefaultMessage: 'Drop your logo or image here, or click to choose a file',

        };

        /***************************************************************************************************
         * removeImage()
         * Removes the current logo from the partner.   The partner will pull up the default image determined
         * by it's type.  This action also removes the image from the image database.
         ****************************************************************************************************/
        $scope.removeImage = function () {
            Images.remove($scope.partner.logo, function(err, file){
                if (err) {
                    console.log('error', err);
                } else {
                    $scope.partner.logo = null;
                }
            });
        };

        /***************************************************************************************************
         * noParentPartners
         * Returns true if no parentPartners are defined for the new partner.   This is used to view/hide
         * the "No parent partners" message with an 'ng-hide' in the view
         ****************************************************************************************************/
        $scope.noParentPartners = function () {
            return (typeof $scope.partner.parentPartners == 'undefined' || $scope.partner.parentPartners.length == 0);
        };

        /***************************************************************************************************
         * addParentPartner
         * Adds the clicked partner ID to the newPartner.parentPartners array.
         ****************************************************************************************************/
        $scope.addParentPartner = function () {

            //first, we need to see if it is already listed, otherwise we could add duplicates.
            if (jQuery.inArray(this.partner._id, $scope.partner.parentPartners) == -1) {
                //if not, add it
                $scope.partner.parentPartners.push(this.partner._id);
            }
        };


        /***************************************************************************************************
         * removeParentPartner
         * Removes the clicked partner ID from the newPartner.parentPartners array and the corresponding
         * object from $scope.parentPartners
         *
         * @property {string} this.parentPartner    the clicked parentPartner that triggeed this function
         *
         ****************************************************************************************************/
        $scope.removeParentPartner = function () {

            //alert("Remove partner " + this.parentPartner._id);
            //remove Parent from $scope.newPartner (used to make the new partner)
            var index;
            index = $scope.partner.parentPartners.indexOf(this.parent); //find it
            if (index > -1) {
                $scope.partner.parentPartners.splice(index, 1); //if found, remove it
            }
        };


        /***************************************************************************************************
         * parentPartnerList
         * This is a collection of 5 partners determined by the search box.  This is used for selecting parent
         * partners.
         ****************************************************************************************************/
        $scope.parentPartnerList = $meteor.collection(function () {

            //if the box is empty, don't show anything
            var listLimit;
            if ($scope.getReactively('parentSearch') == "")
                listLimit = 0;
            else
                listLimit = 5;

            if ($scope.getReactively('parentSearch') != "")
                return Partners.find({
                    'name': {
                        '$regex': '.*' + $scope.getReactively('parentSearch') || '' + '.*',
                        '$options': 'i'
                    }
                }, {limit: listLimit});
        });


    }])
;
