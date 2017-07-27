/**
 * Created by Alex on 10/6/15.
 */

/**
 * REFERENCE FOR PARTNER TYPES:
 company
 individual
 professor
 university
 uniSubOrg
 contact
 incubator
 venture
 association
 other
 */



miz.controller("NewPartnerCtrl", function ($meteor, $state, $scope, $q) {
        var vm = this;
        vm.error = '';

        /***************************************************************************************************
         * object: inputStatusStyling
         * Bootstrap styling classes for form fields.
         * formGroup:  class to be applied to formGroup
         * glyphs:     class to be applied to span following field
         ***************************************************************************************************/


        $scope.inputStatusStyling = {

            noStatus: {
                formGroup: "form-group has-feedback",
                glyphs: ""
            },

            success: {
                formGroup: "form-group has-success has-feedback",
                glyphs: "glyphicon glyphicon-ok form-control-feedback"
            },

            error: {
                formGroup: "form-group has-error has-feedback",
                glyphs: "glyphicon glyphicon-remove form-control-feedback"
            },

            warning: {
                formGroup: "form-group has-warning has-feedback",
                glyphs: "glyphicon glyphicon-warning-sign form-control-feedback"
            }

        };


        /***************************************************************************************************
         * function: resetForm
         * Resets all the form for entry of new user.  Specifically:
         * - resets all form fields to blank
         * - sets enabled checkbox to true
         * - sets all balidation
         ***************************************************************************************************/

        $scope.resetForm = function () {

            $scope.submissionDisabled = true;

            /**
             * $scope.newPartner - this is the main object used to create an new partner.
             */
            $scope.newPartner = {
                // Universal fields for all partners
                name: "",
                description: "",    // for individuals, this is Title
                partnerType: "",    // individual, company, incubator, venture, university, association
                cooperationResource: false, // Marked true if a cooperation resource
                logo: "",            // array of imageIDs
                website: "http://",  // website
                contactInfo: "",     // String - textbox for phone, e-mail, etc.
                notes: "",          // notes
                parentPartners: [], // partnerIDs for which this partner is a member
                bizDevOwners: [],   // userIDs for assigned BD managers
                crsNumber: "",      // CRS database number


                //Reference fields
                primaryContactId: "",
                journalId: [],   //journal entries unique to this partner, not rolled up
                engagementsId: [],   //empty engagements
                subPartnersId: [],   //type is filtered in retrieval, may include individuals, companies, co-op resources


                enabled: true   //implemented as checkbox
            };

            /****
             * ParentPartner Initialization
             *  @type {Array}
             *
             *  There are two datastructures used to manage parent partners.
             *      $scope.parentPartners holds the partner object and is used to display the partner name
             *      in the view.
             *
             *      $scope.newPartner.parentPartners tracks only the ID of parent partners.  This is actually
             *      used in the creation of the new partner.
             ****/
            $scope.parentPartners = [];
            $scope.parentSearch = "";   // search box to find and attach parent Partners.


            /****
             * BizDev Partner Initialization
             *  @type {Array}
             *
             *  There are two data structures used to manage biz dev managers
             *      $scope.bizDevOwners holds the partner object and is used to display the partner name
             *      in the view.
             *
             *      $scope.newPartner.bizDevOwners tracks only the ID of parent partners.  This is actually
             *      used in the creation of the new partner.
             *
             *      In this initialization, we check to see if the current user has the ability to edit engagemnts,
             *      if so, they are likely a cooperation manager and are assigned by default.
             *
             ****/
            $scope.bizDevOwners = [];  // initialize
            // if current user has the ability to create/edit engagements, set them as default owner.
            if (Roles.userIsInRole(Meteor.userId(),
                    ['superAdmin',
                        'editEngagements',
                        'editAllEngagements'])) {
                $scope.newPartner.bizDevOwners.push(Meteor.userId());  // add current user ID to new partner object
                $scope.bizDevOwners.push(Meteor.user());
            }


            $scope.addBizDevOwneSearch = "";


            //validation tracking variables. Set to false if input does not qualify.
            $scope.validationGroup = {
                name: false,  //true for test
                description: false,  //true for test
                partnerType: false
            };        //true for test

            // styling applied to each field depending on validation
            $scope.inputStatusGroup = {
                name: $scope.inputStatusStyling.noStatus,
                description: $scope.inputStatusStyling.noStatus,
                website: $scope.inputStatusStyling.noStatus,
                email: $scope.inputStatusStyling.noStatus
            };

            // string following each field that explains why input is or is not valid
            $scope.inputHelp = {
                name: "",
                description: "",
                email: "",
                partnerType: ""
            };

            // hide name link
            $scope.showDuplicateNameLink = false;

            // reset the wrapped logo file
            $scope.logoObj = null;
        };

        /***************************************************************************************************
         * function: watchCollection - validationGroup
         * Enables or disables submit button. Runs whenever any of the properties in the validation group
         * changes e.g. partner name goes from invalid to valid.
         * If all fields are valid, enables button to create new user account.
         ***************************************************************************************************/

        $scope.$watchCollection('validationGroup', function () {

            var disabled = false;

            for (var validation in $scope.validationGroup) {
                if ($scope.validationGroup.hasOwnProperty(validation)) {
                    if (!$scope.validationGroup[validation]) {
                        disabled = true;
                    }

                }
            }
            $scope.submissionDisabled = disabled;

        });


        /***************************************************************************************************
         * validatePartnerName
         * Validates if a user's information is acceptable and sets hint strings and formatting if not.
         * Parnter names must be strings  and must not already exist.
         * If acceptable, sets inputStatusGroup.username = true, otherwise false..
         ***************************************************************************************************/


        $scope.validatePartnerName = function () {

            //validate not a bad type
            if (typeof $scope.newPartner.name != "string") {
                $scope.inputHelp.name = 'String required.';
                $scope.validationGroup.name = false;
                $scope.inputStatusGroup.name = $scope.inputStatusStyling.error;
            } else

            //validate not blank
            if ($scope.newPartner.name == '') {
                $scope.inputHelp.name = 'Name required';
                $scope.validationGroup.name = false;
                $scope.inputStatusGroup.name = $scope.inputStatusStyling.error;
                return false;
            } else {

                //validate name doesn't already exist
                //do a server call that looks for records matching that name
                //return an error boolean if it exists

                Meteor.call("checkIfPartnerIsUnique", $scope.newPartner.name, function (err, data) {
                    if (err) {

                        // Handle error
                        console.log('failed', err);
                        $scope.createPartnerFeedback = 'Something went wrong when checking if this partner is unique...' + err;

                    } else {
                        // Handle successful check, which may be "UNIQUE" or may be a link to the duplicate partner
                        if (data == "UNIQUE") { //name is unique
                            $scope.showDuplicateNameLink = false;
                            $scope.dataResult = data;
                            $scope.inputHelp.name = $scope.newPartner.name + ' is a new partner...';
                            $scope.validationGroup.name = true;  // We've cleared all validations for username.
                            $scope.inputStatusGroup.name = $scope.inputStatusStyling.success
                        } //if not UNIQUE, returns the ID of the copy
                        else {
                            $scope.showDuplicateNameLink = true;
                            $scope.dataResult = data;
                            $scope.inputHelp.name = $scope.newPartner.name + ' already exists...'; // trying to preset as link
                            $scope.validationGroup["name"] = false;
                            $scope.inputStatusGroup["name"] = $scope.inputStatusStyling.error;
                        }
                    }
                });
            }
        };


        /***************************************************************************************************
         * function: validateProperty
         * Validates the other text fields to ensure they are not blank
         * If acceptable, sets inputStatusGroup.[property] = true, otherwise false..
         ***************************************************************************************************/
        $scope.validateProperty = function (property) {

            for (var i = 0; i < property.length; i++) {

                //validate type

                if (typeof $scope.newPartner[property] != "string") {
                    $scope.inputHelp[property] = 'String required';
                    $scope.validationGroup[property] = false;
                    $scope.inputStatusGroup[property] = $scope.inputStatusStyling.error;
                } else {



                    //validate not blank
                    if ($scope.newPartner[property] === '') {
                        $scope.inputHelp[property] = "Required";
                        $scope.validationGroup[property] = false;
                        $scope.inputStatusGroup[property] = $scope.inputStatusStyling.error;
                    } else {

                        // field ok
                        $scope.inputHelp[property] = "";
                        $scope.validationGroup[property] = true;
                        $scope.inputStatusGroup[property] = $scope.inputStatusStyling.success;
                    }
                }
            }
        };


        /***************************************************************************************************
         * registerPartner
         * Builds a partner object from input form and calls server side function to create new user.
         * Sets createPartnerFeedback with success message w/ partnername or error code.
         ****************************************************************************************************/


        $scope.createPartner = function (postCreateBehavior) {

            //no website was entered, clear the http:// from the field
            if ($scope.newPartner.website == "http://")
                $scope.newPartner.website = "";


            Meteor.call("createPartner", $scope.newPartner, function (err, data) {
                if (err) { // partner creation failure
                    // Handle error
                    console.log('failed', err);
                    $scope.createPartnerFeedback = 'something went wrong with new partner creation...' + err;
                } else {
                    //partner creation success
                    // Handle success
                    console.log('New partner created: ' + data);

                    //set success message
                    $scope.createPartnerFeedback = 'Partner Created: ' + data.name;

                    if (postCreateBehavior == ('registerAndCreateAnother' || null)) {
                        //reset the user entry stuff
                        $scope.resetForm();
                    } else if (postCreateBehavior == ('registerAndOpen')) {
                        window.location.href = "/partners/" + data._id;
                    }

                    // register and open

                    else
                        $scope.resetForm();

                }

            });
        };


        /***************************************************************************************************
         * noParentPartners
         * Returns true if no parentPartners are defined for the new partner.   This is used to view/hide
         * the "No parent partners" message with an 'ng-hide' in the view
         ****************************************************************************************************/
        $scope.noParentPartners = function () {
            if (typeof $scope.newPartner.parentPartners == 'undefined' || $scope.newPartner.parentPartners.length == 0) {
                // the array is undefined or does not have at least one element
                return true;
            } else return false;
        };

        /***************************************************************************************************
         * addParentPartner
         * Adds the clicked partner ID to the newPartner.parentPartners array.
         ****************************************************************************************************/
        $scope.addParentPartner = function () {

            //first, we need to see if it is already listed, otherwise we could add duplicates.
            if (jQuery.inArray(this.partner._id, $scope.newPartner.parentPartners) == -1) {
                //if not, add it
                $scope.newPartner.parentPartners.push(this.partner._id);
                $scope.parentPartners.push(this.partner);
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
            index = $scope.newPartner.parentPartners.indexOf(this.parentPartner._id); //find it
            if (index > -1) {
                $scope.newPartner.parentPartners.splice(index, 1); //if found, remove it
                $scope.parentPartners.splice(index, 1);
                //This is sloppy, assuming they remain in sync instead of checking.  Better to regenerate the index
                //for the second object - but this is working now.
            }
        };


        /***************************************************************************************************
         * MAKE HELPER FUNCTION
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

        /***************************************************************************************************
         * MAKE HELPER FUNCTION
         * bizDevOwner List
         * This is a collection of 5 users determined by the search box.  This is used for selecting BD
         * owners.
         ****************************************************************************************************/
        $scope.bizDevOwnerList = $meteor.collection(function () {


            return Meteor.users.find({

                'roles': {'$regex': 'editEngagements' || 'editAllEngagement', '$options': 'i'}

            }, {})
        });


        /***************************************************************************************************
         * noBizDevOwners
         * Returns true if no bizDevOwners are defined for the new partner.   This is used to view/hide
         * the "No Biz Dev Owners" message with an 'ng-hide' in the view
         ****************************************************************************************************/
        $scope.noBizDevOwners = function () {
            if (typeof $scope.newPartner.bizDevOwners == 'undefined' || $scope.newPartner.bizDevOwners.length == 0) {
                // the array is undefined or does not have at least one element
                return true;
            }
        };


        /***************************************************************************************************
         * addBizDevOwner
         * Adds the clicked user ID to the newPartner.bizDevOwners array, and a User Object to the corresponding
         * $scope.bizDevOwners array, so that names can be presented.
         *
         * @property {string} this.bizDevOwner    the clicked bizDevOwner that triggered this function
         *
         ****************************************************************************************************/
        $scope.addBizDevOwner = function () {

            if (Roles.userIsInRole(this.bizDevOwner._id,
                    ['superAdmin',
                        'editEngagements',
                        'editAllEngagements'])) {
                //first, we need to see if it is already listed, otherwise we could add duplicates.
                if (jQuery.inArray(this.bizDevOwner._id, $scope.newPartner.bizDevOwners) == -1) {
                    //if not, add it
                    $scope.newPartner.bizDevOwners.push(this.bizDevOwner._id);
                    $scope.bizDevOwners.push(this.bizDevOwner);
                }
            }
        };

        /***************************************************************************************************
         * removeBizDevOwner
         * Removes the clicked user ID from the newPartner.bizDevOwners array and the corresponding
         * object from $scope.bizDevOwners
         ****************************************************************************************************/
        $scope.removeBizDevOwner = function () {

            //remove Parent from $scope.newPartner (used to make the new partner)
            var index = $scope.newPartner.bizDevOwners.indexOf(this.bizDevOwner._id); //find it
            if (index > -1) {
                $scope.newPartner.bizDevOwners.splice(index, 1); //if found, remove it
                $scope.bizDevOwners.splice(index, 1);
                //This is sloppy, assuming they remain in sync instead of checking.  Better to regenerate the index
                //for the second object - but this is working now.
            }
        };

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
                        $scope.newPartner.logo = fileObj._id;

                    }

                })

            },

            dictDefaultMessage: 'Drop your logo or image here, or click to choose a file',

        };


        /***************************************************************************************************
         * autorun function
         * Subscribes to the partner list, updateds listedmrypartners based on parentPartnerSearch
         * Note - this is good reference code for how to create a Google-search like experience - no
         * records are shown until something is put into the search box.
         ****************************************************************************************************/
        $meteor.autorun($scope, function () {

            // if there's nothing in the search field, don't show any records
            if ($scope.getReactively('parentSearch') && $scope.getReactively('parentSearch')) {
                $scope.$meteorSubscribe('partnerList',
                    {
                        limit: 5
                    },

                    $scope.getReactively('parentSearch')
                );
            }

            // note that the current user will always appear - it's loaded from the user collection
            if ($scope.getReactively('bizDevOwnerSearch') && $scope.getReactively('bizDevOwnerSearch')) {
                $meteor.subscribe('userList',
                    {
                        limit: 5
                    },

                    $scope.getReactively('bizDevOwnerSearch'), "editEngagements"
                );
            }

        });

        $scope.googleImgLink = function () {
            var link;
            link = "http://www.google.com/search?q=" + $scope.newPartner.name + "&tbm=isch";
            return link;
        };

        /***************************************************************************************************
         * this hackery makes the rows in bootstrap clickable.
         ****************************************************************************************************/
        jQuery(document).ready(function ($) {
            $(".clickable-row").click(function () {
                alert("table clicked...");
                window.document.location = $(this).data("url");
            });
        });


        /***************************************************************************************************
         * Start main controller
         **************************************************************************************************/

            //Initialize the form.

        $scope.resetForm();

// clear feedback string given after partner created.
        $scope.createPartnerFeedback = '';


    }
);