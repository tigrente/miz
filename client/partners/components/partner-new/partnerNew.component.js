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

/*********************************************************************************************************
 * <partner-new>
 *     This directive is the creation view for partners.  It validates field, builds a partner object and
 *     then hands it to the server for insertion into the DB.
 *     NOTE: Since Angular-Meteor 1.3, Autobind has been removed, so changes to the client must be pushed
 *     back to the record.
 *********************************************************************************************************/

miz.directive("partnerNew", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/partners/components/partner-new/partner-new.ng.html',
            controllerAs: 'pn',
            bindToController: true,
            controller: function ($scope, $reactive) {

                $reactive(this).attach($scope);

                /** INITIALIZATION **/

                document.title = "Miz: Create New Partner";

                    //validation tracking variables. Set to false if input does not qualify. Setting ahead of helper.
                this.validationGroup = {
                    name: false,  //true for test
                    description: false,  //true for test
                    partnerType: false
                };        //true for test

                this.partnerSearch = '';

                this.newPartner = {
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
                    childrenPartners: [],   //partnerIDs for members of this partner (e.g. employees)
                    bizDevOwners: [],   // userIDs for assigned BD managers
                    crsNumber: "",      // CRS database number


                    //Reference fields
                    primaryContactId: "",
                    journalId: [],   //journal entries unique to this partner, not rolled up
                    engagementsId: [],   //empty engagements
                    subPartnersId: [],   //type is filtered in retrieval, may include individuals, companies, co-op resources


                    enabled: true   //implemented as checkbox
                };


                /***************************************************************************************************
                 * object: inputStatusStyling
                 * Bootstrap styling classes for form fields.
                 * formGroup:  class to be applied to formGroup
                 * glyphs:     class to be applied to span following field
                 ***************************************************************************************************/


                this.inputStatusStyling = {

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


                /** HELPERS **/

                this.helpers({

                    /** disable submit button if fields are not validated or no info has changed*/
                    submissionDisabled: () => {
                        // true is for deep reactivity, trigger if any property changes.
                        this.getReactively('validationGroup', true);

                        //if every validation is true, submissionDisabled is false (submit button enabled)
                        return !(_.every(this.validationGroup));
                    },

                    /** Collection of Parent partners of the feature partner */
                    parentPartners: () => {
                        if (this.getReactively("newPartner.parentPartners")) {
                            return Partners.find({
                                _id: {$in: this.newPartner.parentPartners}
                            });
                        }
                    },

                    /** A list of potential parent partners generated from the parent Search bar */
                    parentPartnerSearchList: () => {
                        this.getReactively('parentSearch');

                        return Partners.find({
                            'name': {
                                '$regex': '.*' + this.parentSearch || '' + '.*', '$options': 'i'
                            }/*,
                            'partnerType': {
                                $in: [                    // adding a parent that is not an individual.
                                    'company',
                                    'university',
                                    'uniSubOrg',
                                    'incubator',
                                    'venture',
                                    'association',
                                    'other'
                                ]
                            }*/

                        }, );

                    },

                    /** A list of potential bizdev owners generated from the bizdev Search bar
                     * Note:  Admin user should not show unless user is admin.   Users own address
                     * doesn't show unless they have the 'edit-engagements' role.*/
                    bizDevOwnerSearchList: () => {
                        this.getReactively('bizDevOwnerSearch');

                        var options = {
                            limit: 5
                        };

                        selector = {
                            $and: [
                                {
                                    $or: [
                                        {
                                            'username': {
                                                '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.name': {
                                                '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.company': {
                                                '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.group': {
                                                '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.huaweiId': {
                                                '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'emails.address': {
                                                '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        }
                                    ]
                                },

                                {
                                    $or: [
                                        {roles: {$elemMatch: {$eq: 'editEngagements'}}},
                                        {roles: {$elemMatch: {$eq: 'editAllEngagements'}}}
                                    ]
                                }
                            ]
                        };

                        return Meteor.users.find({}, options);

                    },

                    /** Collection of Business Development Owners attached to partner*/
                    bizDevOwners: () => {
                            return Meteor.users.find({
                                _id: {$in: this.getReactively('newPartner.bizDevOwners', true)}
                        });
                    }


                });

                /** SUBSCRIPTIONS **/

                /** Subscription to attach images **/
                this.subscribe('images');

                /** Subscription to search for new parentPartners **/
                this.subscribe('parentPartnerSearch', ()=> {
                    return [
                        this.getReactively('parentSearch')
                    ]
                });

                /** Subscription to list partners added to newPartner **/
                this.subscribe('partnerInfo', ()=> {
                    return [
                        //array of partnerIds to return
                        this.getReactively('newPartner.parentPartners'),

                        //options for find
                        {
                            fields: {
                                name: 1,
                                partnerType: 1
                            }
                        }
                    ]
                });

                /** Subscription to user list to search for bizDevOwners */
                this.subscribe('userBizDevOwnerSearch', ()=> {
                    return [
                        // searchTerm
                        this.getReactively('bizDevOwnerSearch')
                    ]
                });


                /** Subscription to users for list of current biz dev owners. */

                this.subscribe('userSimpleList', ()=> {
                    return [
                        // array of user ids to look up
                        this.getReactively('newPartner.bizDevOwners', true)
                    ]
                });


                /** FUNCTIONS **/

                /***************************************************************************************************
                 * function: resetForm
                 * Resets all the form for entry of new user.  Specifically:
                 * - resets all form fields to blank
                 * - sets enabled checkbox to true
                 * - sets all validation
                 ***************************************************************************************************/

                this.resetForm = function () {

                    /**
                     * this.newPartner - this is the main object used to create an new partner.  These are tied
                     * to the fields in the view for two way reactivity - but not to the server.  Submission
                     * is required.
                     */
                    this.newPartner = {
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
                        childrenPartners: [],   //partnerIDs for members of this partner (e.g. employees)
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
                     *      There are two datastructures used to manage parent partners.
                     *      this.parentPartners holds the partner object and is used to display the partner name
                     *      in the view.
                     *
                     *      this.newPartner.parentPartners tracks only the ID of parent partners.  This is actually
                     *      used in the creation of the new partner.
                     ****/

                    this.parentSearch = "";   // search box to find and attach parent Partners.


                    /****
                     * BizDev Partner Initialization
                     *  @type {Array}
                     *
                     *      There are two data structures used to manage biz dev managers
                     *      this.bizDevOwners holds the partner object and is used to display the partner name
                     *      in the view.
                     *
                     *      this.newPartner.bizDevOwners tracks only the ID of parent partners.  This is actually
                     *      used in the creation of the new partner.
                     *
                     *      In this initialization, we check to see if the current user has the ability to edit engagements,
                     *      if so, they are likely a cooperation manager and are assigned by default.
                     *
                     ****/

                    // if current user has the ability to create/edit engagements, set them as default owner.
                    if (Roles.userIsInRole(Meteor.userId(),
                            ['superAdmin',
                                'editEngagements',
                                'editAllEngagements'])) {
                        this.newPartner.bizDevOwners.push(Meteor.userId());  // add current user ID to new partner object
                    }

                    // search box for adding biz dev owner
                    this.addBizDevOwnerSearch = "";


                    //validation tracking variables. Set to false if input does not qualify.
                    this.validationGroup = {
                        name: false,  //true for test
                        description: false,  //true for test
                        partnerType: false
                    };        //true for test

                    // styling applied to each field depending on validation
                    this.inputStatusGroup = {
                        name: this.inputStatusStyling.noStatus,
                        description: this.inputStatusStyling.noStatus
                    };

                    // string following each field that explains why input is or is not valid
                    this.inputHelp = {
                        name: "",
                        description: ""
                    };

                    // hide name link ,shown when name already exists
                    this.showDuplicateNameLink = false;

                    // reset the wrapped logo file
                    this.logoObj = null;
                };

                /***************************************************************************************************
                 * validatePartnerName
                 * Validates if a user's information is acceptable and sets hint strings and formatting if not.
                 * Partner names must be strings and must not already exist.
                 * If acceptable, sets inputStatusGroup.username = true, otherwise false..
                 ***************************************************************************************************/


                this.validatePartnerName = function () {

                    //validate not a bad type
                    if (typeof this.newPartner.name != "string") {
                        this.inputHelp.name = 'String required.';
                        this.validationGroup.name = false;
                        this.inputStatusGroup.name = this.inputStatusStyling.error;
                    } else

                    //validate not blank
                    if (this.newPartner.name == '') {
                        this.inputHelp.name = 'Name required';
                        this.validationGroup.name = false;
                        this.inputStatusGroup.name = this.inputStatusStyling.error;
                        return false;
                    } else {

                        //validate name doesn't already exist
                        //do a server call that looks for records matching that name
                        //return an error boolean if it exists

                        this.call("checkIfPartnerIsUnique", this.newPartner.name, (err, data) => {
                            if (err) {

                                // Handle error
                                console.log('failed', err);
                                this.createPartnerFeedback = 'Something went wrong when checking if this partner is unique...' + err;

                            } else {
                                // Handle successful check, which may be "UNIQUE" or may be a link to the duplicate partner
                                if (data == "UNIQUE") { //name is unique
                                    this.showDuplicateNameLink = false;
                                    this.dataResult = data;
                                    this.inputHelp.name = this.newPartner.name + ' is a new partner...';
                                    this.validationGroup.name = true;  // We've cleared all validations for username.
                                    this.inputStatusGroup.name = this.inputStatusStyling.success
                                } //if not UNIQUE, returns the ID of the copy
                                else {
                                    this.showDuplicateNameLink = true;
                                    this.dataResult = data;
                                    this.inputHelp.name = this.newPartner.name + ' already exists...'; // trying to preset as link
                                    this.validationGroup["name"] = false;
                                    this.inputStatusGroup["name"] = this.inputStatusStyling.error;
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
                this.validateProperty = function (property) {

                    for (var i = 0; i < property.length; i++) {

                        //validate type

                        if (typeof this.newPartner[property] != "string") {
                            this.inputHelp[property] = 'String required';
                            this.validationGroup[property] = false;
                            this.inputStatusGroup[property] = this.inputStatusStyling.error;
                        } else {



                            //validate not blank
                            if (this.newPartner[property] === '') {
                                this.inputHelp[property] = "Required";
                                this.validationGroup[property] = false;
                                this.inputStatusGroup[property] = this.inputStatusStyling.error;
                            } else {

                                // field ok
                                this.inputHelp[property] = "";
                                this.validationGroup[property] = true;
                                this.inputStatusGroup[property] = this.inputStatusStyling.success;
                            }
                        }
                    }
                };


                /***************************************************************************************************
                 * createPartner
                 * Builds a partner object from input form and calls server side function to create new user.
                 * Sets createPartnerFeedback with success message w/ partnername or error code.
                 ****************************************************************************************************/

                this.createPartner = function (postCreateBehavior) {

                    //no website was entered, clear the http:// from the field
                    if (this.newPartner.website == "http://")
                        this.newPartner.website = "";


                    this.call("createPartner", this.newPartner, (err, data) => {
                        if (err) { // partner creation failure
                            // Handle error
                            console.log('failed', err);
                            this.createPartnerFeedback = 'something went wrong with new partner creation...' + err;
                        } else {
                            //partner creation success
                            // Handle success
                            console.log('New partner created: ' + data);

                            //set success message
                            this.createPartnerFeedback = 'Partner Created: ' + data.name;

                            if (postCreateBehavior == ('registerAndCreateAnother' || null)) {
                                //reset the user entry stuff
                                this.resetForm();
                            } else if (postCreateBehavior == ('registerAndOpen')) {
                                window.location.href = "/partners/" + data._id;
                            }

                            // register and open

                            else
                                this.resetForm();

                        }

                    });
                };


                /***************************************************************************************************
                 * noParentPartners
                 * Returns true if no parentPartners are defined for the new partner.   This is used to view/hide
                 * the "No parent partners" message with an 'ng-hide' in the view
                 ****************************************************************************************************/
                this.noParentPartners = function () {
                    return typeof this.newPartner.parentPartners == 'undefined' ||
                        this.newPartner.parentPartners.length == 0;
                };


                /***************************************************************************************************
                 * addParentPartner
                 * Adds the clicked partner ID to the newPartner.parentPartners array.
                 ****************************************************************************************************/
                this.addParentPartner = function (parent) {
                    //alert('Parent partner add attempted:'+ parent.name);
                    //first, we need to see if it is already listed, otherwise we could add duplicates.
                    if (!_.contains(this.newPartner.parentPartners, parent._id)) {
                        //if not, add it
                        this.newPartner.parentPartners.push(parent._id);
                        this.parentPartners.push(parent);
                    }
                };


                /***************************************************************************************************
                 * removeParentPartner
                 * Removes the clicked partner ID from the newPartner.parentPartners array and the corresponding
                 * object from this.parentPartners
                 *
                 * @property {string} this.parentPartner    the clicked parentPartner that triggeed this function
                 *
                 ****************************************************************************************************/
                this.removeParentPartner = function (parent) {

                    //alert("Remove parent " + parent.name);
                    //remove Parent from this.newPartner (used to make the new partner)
                    var index;
                    this.newPartner.parentPartners = _.without(this.newPartner.parentPartners, parent._id); //remove all matching values
                    this.parentPartners = _.without(this.parentPartners, _.findWhere(this.parentPartners, {id: parent._id}));
                };


                /***************************************************************************************************
                 * noBizDevOwners
                 * Returns true if no bizDevOwners are defined for the new partner.   This is used to view/hide
                 * the "No Biz Dev Owners" message with an 'ng-hide' in the view
                 ****************************************************************************************************/
                this.noBizDevOwners = function () {
                    if (this.newPartner.bizDevOwners.length == 0)
                        return true;
                };


                /***************************************************************************************************
                 * addBizDevOwner
                 * Adds the clicked user ID to the newPartner.bizDevOwners array, and a User Object to the corresponding
                 * this.bizDevOwners array, so that names can be presented.
                 *
                 * @property {string} this.bizDevOwner    the clicked bizDevOwner that triggered this function
                 *
                 ****************************************************************************************************/
                this.addBizDevOwner = function (bizDevOwner) {
                    //alert('Adding:' + bizDevOwner.profile.name + ' ' + bizDevOwner._id);

                    //first, we need to see if it is already listed, otherwise we could add duplicates.
                        if (!_.contains(this.newPartner.bizDevOwners, bizDevOwner._id)) {
                            this.newPartner.bizDevOwners.push(bizDevOwner._id);
                            //this.bizDevOwners.push(bizDevOwner._id);
                        }

                };


                /***************************************************************************************************
                 * removeBizDevOwner
                 * Removes the clicked user ID from the newPartner.bizDevOwners array and the corresponding
                 * object from this.bizDevOwners
                 ****************************************************************************************************/
                this.removeBizDevOwner = function (bizDevOwner) {

                    //remove Parent from this.newPartner (used to make the new partner)
                    this.newPartner.bizDevOwners = _.without(this.newPartner.bizDevOwners, bizDevOwner._id);

                };

                /***************************************************************************************************
                 * logoDropzoneOptions
                 * Options for the logo/photo insertion drop zone
                 ****************************************************************************************************/



                this.logoDropzoneOptions = {
                    self: this,
                    acceptedFiles: 'image/*',
                    maxFilesize: 300,
                    uploadMultiple: false,
                    addRemoveLinks: true,
                    maxFiles: 1,
                    dictDefaultMessage: 'Drop your logo or image here, or click to choose a file',


                    init: function () {
                        var self = this;
                        // First change the button to actually tell Dropzone to process the queue.

                        // Limit the number of uploaded logos to just one.
                        self.on("addedfile", function () {
                            if (self.files[1] != null) {
                                self.removeFile(self.files[0]);
                            }
                        });
                    },

                    // NOTE: Using Arrow functions here because they automatically bind to the scope of the caller.  This
                    // brings our Angular object into these call backs. Using normal functions would cause 'this' to be
                    // lexically out of scope and unrecognized.  A lot of Bothans died to bring us this information...
                    accept: (file, done) => {

                        $(".dz-progress").remove();  // hiding progress bar, otherwise it stays there...
                        var logoObj = new FS.File(file);
                        logoObj.owner = Meteor.userId();
                        logoObj.createdBy = Meteor.userId();


                        Images.insert(logoObj, (err, fileObj) => {
                            if (err) {
                                alert(err);// handle error
                            } else {
                                // handle success depending what you need to do
                                this.newPartner.logo = fileObj._id;

                            }

                        })

                    }
                };


                /***************************************************************************************************
                 * Start main controller
                 **************************************************************************************************/

                    //Initialize the form.

                this.resetForm();
                this.createPartnerFeedback = '';

            }
        }
    }
);