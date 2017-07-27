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

miz.directive("labNew", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/labs/components/lab-new/lab-new.ng.html',
            controllerAs: 'ln',
            bindToController: true,
            controller: function ($scope, $reactive) {

                $reactive(this).attach($scope);

                /** INITIALIZATION **/

                //validation tracking variables. Set to false if input does not qualify. Setting ahead of helper.
                this.validationGroup = {
                    name: false,  //true for test
                    company: false
                };        //true for test

                this.labSearch = '';

                this.newLab = {
                    // Universal fields for all partners
                    name: "",
                    description: "",    // for individuals, this is Title
                    logo: "",
                    parentLab: [], // partnerIDs for which this partner is a member
                    childrenLabs: [],   //partnerIDs for members of this partner (e.g. employees)
                    bizDevOwners: [],   // userIDs for assigned BD managers
                    labDeptNumber: "",      // Lab Number from W3
                    leader: "",

                    //Reference fields

                    journalId: [],   //journal entries unique to this lab, not rolled up
                    engagementIds: [],   //empty engagements

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
                        parentLab: () => {
                            if (this.getReactively("newLab.parentLab")) {
                                return Labs.find({
                                    _id: this.newLab.parentLab
                                });
                            }
                        },



                        /** Collection of Business Development Owners attached to partner*/
                        bizDevOwners: () => {
                            return Meteor.users.find({
                                _id: {$in: this.getReactively('newLab.bizDevOwners', true)}
                            });
                        }


                    }
                );

                /** SUBSCRIPTIONS **/

                /** Subscription to attach images **/
                this.subscribe('images');

                /** Subscription to search for new parentPartners **/
                this.subscribe('labPartnerSearch', ()=> {
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
                        entity: "2012 Labs",
                        company: "",
                        description: "",
                        logo: "",
                        parentLab: "",
                        childrenLabs: [],
                        bizDevOwners: [],
                        leader: "",


                        //Reference fields

                        journalId: [],   //journal entries unique to this partner, not rolled up
                        engagementIds: [],   //empty engagements

                        enabled: true   //implemented as checkbox
                    };

                    this.otherCompanyName = ''; // other name entry for new companies

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
                        company: false
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


                //validation tracking variables. Set to false if input does not qualify.
                this.validateOther = function (){
                    if (this.newLab.company == 'other' && this.otherCompanyName != '')
                        this.validationGroup.company = true;
                };


                /***************************************************************************************************
                 * validatePartnerName
                 * Validates if a user's information is acceptable and sets hint strings and formatting if not.
                 * Partner names must be strings and must not already exist.
                 * If acceptable, sets inputStatusGroup.username = true, otherwise false..
                 ***************************************************************************************************/


                this.validateLabName = function () {

                    //validate not a bad type
                    if (typeof this.newLab.name != "string") {
                        this.inputHelp.name = 'String required.';
                        this.validationGroup.name = false;
                        this.inputStatusGroup.name = this.inputStatusStyling.error;
                    } else

                    //validate not blank
                    if (this.newLab.name == '') {
                        this.inputHelp.name = 'Name required';
                        this.validationGroup.name = false;
                        this.inputStatusGroup.name = this.inputStatusStyling.error;
                        return false;
                    } else {

                        //validate name doesn't already exist
                        //do a server call that looks for records matching that name
                        //return an error boolean if it exists

                        this.call("checkIfPartnerIsUnique", this.newLab.name, (err, data) => {
                            if (err) {

                                // Handle error
                                console.log('failed', err);
                                this.createLabFeedback = 'Something went wrong when checking if this partner is unique...' + err;

                            } else {
                                // Handle successful check, which may be "UNIQUE" or may be a link to the duplicate partner
                                if (data == "UNIQUE") { //name is unique
                                    this.showDuplicateNameLink = false;
                                    this.dataResult = data;
                                    this.inputHelp.name = this.newLab.name + ' is a new lab...';
                                    this.validationGroup.name = true;  // We've cleared all validations for username.
                                    this.inputStatusGroup.name = this.inputStatusStyling.success
                                } //if not UNIQUE, returns the ID of the copy
                                else {
                                    this.showDuplicateNameLink = true;
                                    this.dataResult = data;
                                    this.inputHelp.name = this.newLab.name + ' already exists...'; // trying to preset as link
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

                        if (typeof this.newLab[property] != "string") {
                            this.inputHelp[property] = 'String required';
                            this.validationGroup[property] = false;
                            this.inputStatusGroup[property] = this.inputStatusStyling.error;
                        } else {



                            //validate not blank
                            if (this.newLab[property] === '') {
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
                 * createLab
                 * Builds a partner object from input form and calls server side function to create new user.
                 * Sets createPartnerFeedback with success message w/ labName or error code.
                 ****************************************************************************************************/

                this.createLab = function (postCreateBehavior) {


                    this.call("createLab", this.newLab, (err, data) => {
                        if (err) { // partner creation failure
                            // Handle error
                            console.log('failed', err);
                            this.createLabFeedback = 'something went wrong with new partner creation...' + err;
                        } else {
                            //partner creation success
                            // Handle success
                            console.log('New lab created: ' + data);

                            //set success message
                            this.createLabFeedback = 'Lab Created: ' + data.name;

                            if (postCreateBehavior == ('registerAndCreateAnother' || null)) {
                                //reset the user entry stuff
                                this.resetForm();
                            } else if (postCreateBehavior == ('registerAndOpen')) {
                                window.location.href = "/labs/" + data._id;
                            }

                            // register and open

                            else
                                this.resetForm();

                        }

                    });
                };






                /***************************************************************************************************
                 * Start main controller
                 **************************************************************************************************/

//Initialize the form.

                this.resetForm();
                this.createLabFeedback = '';


            }
        }
    }
)
;