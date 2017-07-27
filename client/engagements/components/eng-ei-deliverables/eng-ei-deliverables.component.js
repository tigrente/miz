/*********************************************************************************************************
 * <eng-ei-deliverables>
 *     This directive is for displaying and editing early innovation payment schedules
 *********************************************************************************************************/


miz.directive("engEiDeliverables", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-deliverables/eng-ei-deliverables.ng.html',
        controllerAs: 'eid',
        scope: false, // create seperate copy of scope
        bindToController: {
            focusEngagementId: "@"
        },

        controller: function ($scope, $reactive) {


            $reactive(this).attach($scope);

            /** Initialize **/

            const ONE_DAY = 1000 * 60 * 60 * 24;    //Get 1 day in milliseconds
            const ONE_WEEK = ONE_DAY * 7;           //Get 1 week in milliseconds
            const ONE_MONTH = ONE_DAY * 30.42;      //Get about 1 month in milliseconds

            //froala WYSIWYG options
            $.FroalaEditor.DEFAULTS.key = 'evjavgjH3fij==';

            this.froalaOptions = {
                toolbarButtons: [
/*                    // 'fullscreen',
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
                    // 'html'*/
                ],

                toolbarButtonsMD: [
/*                    'bold',
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
                    'clearFormatting',*/
                ],


                /*                quickInsertButtons: [  // quick upload buttons plugin not included below
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


            //template for all new payment entries
            let paymentTemplate = {
                milestone: "",
                deliverable: "",
                relativeTime: '?',
                targetDate: null,
                paymentAmount: 0,
                paymentPercentage: 0
            };


            // defaults for payment setup screen
            this.initializer = {
                dealValue: 0,
                numberOfPayments: 3,
                dateCalculation: 'relative',
                relativeDateUnit: 'weeks',
                paymentCalculation: 'specific'
            };




            //ui helpers
            this.ui = {
                editDeliverables: false,  //true for development, otherwise should be false
                relativeDates: true,
            };

            this.newPaymentSchedule = 'initializing';


            this.paymentSchedule = [];

            /** HELPERS **/
            this.helpers({


                    // get current engagement
                    focusEngagement: () => {
                        this.getReactively('focusEngagementId');


                        if (this.focusEngagementId) {
                            let engagement = Engagements.findOne(this.focusEngagementId);
                            this.initializer.dealValue = engagement.dealValue;
                            return engagement;

                        }

                    },

                    //direct pointer to early innovation data property
                    //also initializes data if its not there
                    paymentSchedule: () => {

                        this.getReactively('focusEngagement.earlyInnovationProjectData', true);

                        if (this.focusEngagement) {

                            // check to see if EI data present.  If not, let parent handle it and just ignore.
                            if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                                this.call("engagementInitializeEarlyInnovationProjectData", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Issue initializing Early Innovation Project data in engagement.");

                                    $scope.$apply();
                                });
                            }

                            // check if A&P data is present.  If not, call server to create template and update.
                            else if (!this.focusEngagement.earlyInnovationProjectData.hasOwnProperty('acceptanceAndPayments')) {
                                this.call("engagementResetEIAcceptanceAndPayments", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        this.ui.editPaymentSchedule = true;
                                        $scope.$apply();
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule;
                                    }
                                });
                            }

                            // if A&P template exists, but paymentSchedule doesn't, reset (should never get here, but safety first)
                            else if (!this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.hasOwnProperty('paymentSchedule')) {
                                this.call("engagementResetEIAcceptanceAndPayments", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        this.ui.editPaymentSchedule = true;
                                        $scope.$apply();
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule;
                                    }
                                });
                            }


                            // otherwise, payment schedule exists, return it.

                            else
                                return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule;
                        } // if (focusEngagement)


                    }, //paymentSchedule


                    options: () => {

                        this.getReactively('focusEngagement.earlyInnovationProjectData', true);

                        if (this.focusEngagement) {

                            // check to see if EI data present.  If not, let parent handle it and just ignore.
                            if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                                return null
                            }

                            // check if A&P data is present.  If not, call server to create template and update.
                            else if (!this.focusEngagement.earlyInnovationProjectData.hasOwnProperty('acceptanceAndPayments')) {
                                this.call("engagementResetEIAcceptanceAndPayments", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options;
                                    }
                                });
                            }

                            // if options exists, but paymentSchedule doesn't, reset (should never get here, but safety first)
                            else if (!this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.hasOwnProperty('options')) {
                                this.call("engagementResetEIAcceptanceAndPayments", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options;
                                    }
                                });
                            }


                            // otherwise, payment schedule exists, return it.

                            else return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options;
                        } // if (focusEngagement)


                    }, //paymentSchedule

                    additionalPayments: () => {

                        this.getReactively('focusEngagement.earlyInnovationProjectData', true);

                        if (this.focusEngagement) {

                            // check to see if EI data present.  If not, let parent handle it and just ignore.
                            if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                                return null
                            }

                            // check if A&P data is present.  If not, call server to create template and update.
                            else if (!this.focusEngagement.earlyInnovationProjectData.hasOwnProperty('acceptanceAndPayments')) {
                                this.call("engagementResetEIAcceptanceAndPayments", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalPayments;
                                    }
                                });
                            }

                            // if acceptanceAndPayment exists, but additionalPayments doesn't, reset (should never get here, but safety first)
                            else if (!this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.hasOwnProperty('additionalPayments')) {
                                this.call("engagementResetEIAcceptanceAndPayments", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalPayments;
                                    }
                                });
                            }


                            // otherwise, additional payments exists, return it.

                            else return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalPayments;
                        } // if (focusEngagement)


                    }, //additional payments

                    formattedDealValue: () => {
                        if (this.getReactively("focusEngagement.earlyInnovationProjectData.contract.contractValue")) {
                            let fdl = this.focusEngagement.earlyInnovationProjectData.contract.contractValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return "$" + fdl;

                        } else return null;
                    }, //formatedDealValue

                    unallocatedPercentage: () => {

                        this.getReactively("focusEngagement.earlyInnovationProjectData.contract.contractValue");
                        this.getReactively("paymentSchedule");

                        if (!this.focusEngagement.earlyInnovationProjectData.contract.contractValue)
                            return "Total contract value not defined";
                        else if (!this.getReactively("paymentSchedule"))
                            return "Payment Schedule doesn't exist";
                        else {
                            let allocation = 0;  // the amount of percentage already allocationd
                            for (let i = 0; i < this.paymentSchedule.length; ++i)
                                allocation += this.paymentSchedule[i].paymentPercentage;

                            return 100 - allocation;


                        }

                    }, //unallocated percentage

                    unallocatedAmount: () => {

                        this.getReactively("focusEngagement.earlyInnovationProjectData.contract.contractValue");
                        this.getReactively("paymentSchedule", true);

                        if (!this.focusEngagement.earlyInnovationProjectData.contract.contractValue)
                            return "Total contract value not defined";
                        else if (!this.getReactively("paymentSchedule"))
                            return "Payment Schedule doesn't exist";
                        else {
                            let allocation = 0;  // the amount of percentage already allocationd
                            for (let i = 0; i < this.paymentSchedule.length; ++i)
                                allocation += this.paymentSchedule[i].paymentAmount;

                            return this.focusEngagement.earlyInnovationProjectData.contract.contractValue - allocation;


                        }

                    },

                    // Check to see if all payments have valid dates
                    scheduleComplete: () => {

                        this.getReactively("paymentSchedule", true);


                        if (this.paymentSchedule) {
                            let complete = true;

                            for (let i = 0; i < this.paymentSchedule.length; ++i) {
                                // check to see if the target date is valid.


                                if (Object.prototype.toString.call(this.paymentSchedule[i].targetDate) === "[object Date]") {
                                    // it is a date
                                    if (isNaN(this.paymentSchedule[i].targetDate.getTime())) {
                                        // date is not valid
                                        complete = false;
                                    }
                                }
                                else {
                                    // not a date
                                    complete = false;
                                }
                            }//for
                            return complete;
                        }
                    },  //scheduleComplete
                }
            );


            /** SUBSCRIPTIONS **/
            /*            this.subscribe('logEntries', () => {
             return [
             this.getReactively('subjectId'),
             this.getReactively('limit'),
             this.getReactively('sort')
             ]
             });*/


            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun


            /** FUNCTIONS */

            /***************************************************************************************************
             * isNumber
             * Returns true if the object is a number, either in string or number form.
             ****************************************************************************************************/

            let isNumber = function isNumber(obj) {
                return !isNaN(parseFloat(obj))
            };

            /***************************************************************************************************
             * updatePaymentTargetDate
             * Takes index of payment from focus engagement.
             * Updates the actual schedule and calculates the relative schedule.  Should only be called in "specific"
             * date option is active.
             ****************************************************************************************************/
            this.updatePaymentTargetDate = function () {

                if (this.options.dateCalculation === "specific")
                    this.calculateRelativeTimes();

            };


            /***************************************************************************************************
             * formattedDealValue
             * Takes a value and returns a nicely formatted string.
             ****************************************************************************************************/
            this.formatCurrency = function (value) {

                let fdl = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return "$" + fdl;

            };

            /***************************************************************************************************
             * initializePaymentSchedule
             * Take a set number of payments template array for the schedule.
             ****************************************************************************************************/

            this.initializePaymentSchedule = function () {

                this.paymentSchedule = [];

                for (let i = 0; i < this.initializer.numberOfPayments; ++i) {
                    this.paymentSchedule.push(paymentTemplate);

                }

                this.focusEngagement.earlyInnovationProjectData.contract.contractValue = this.initializer.dealValue;
                this.focusEngagement.dealValue = this.initializer.dealValue;
                this.updateContractData();

                this.updatePaymentOption('dateCalculation', this.initializer.dateCalculation);
                this.updatePaymentOption('paymentCalculation', this.initializer.paymentCalculation);
                this.updatePaymentOption('relativeDateUnit', this.initializer.relativeDateUnit);


                this.updatePaymentSchedule();
                this.ui.editPaymentSchedule = true;
                // / This is wacky - you must update on the server, or else you get
                // weird ng-repeat issues.


            };

            /***************************************************************************************************
             * addPayment
             * Adds another payment to PaymentSchedule
             ****************************************************************************************************/

            this.addPayment = function () {


                this.paymentSchedule.push(paymentTemplate);
                this.updatePaymentSchedule();

                /*this.call("engagementUpdateEIPaymentSchedule", this.focusEngagementId, angular.copy(newPaymentSchedule));*/


            };

            /***************************************************************************************************
             * removePaymentPayment
             * Accepts index of payment to be removed from os.
             ****************************************************************************************************/

            this.removePayment = function (index) {

                this.paymentSchedule.splice(index, 1);

                this.updatePaymentSchedule();

                /* this.call("engagementUpdateEIPaymentSchedule", this.focusEngagementId, angular.copy(newPaymentSchedule));*/


            };


            /***************************************************************************************************
             * calculateRelativeTimes
             * Internal function that calculates the relative time given signing date and target date.
             * Returns a notifier string if target happens after sigining or no signing date.
             * Note that this pulls the "relativeUnit" from the options of the paymentSchedule e.g. weeks, vs. months
             ****************************************************************************************************/

            this.calculateRelativeTimes = function () {

                if (this.options.dateCalculation === "specific") {


                    let signingDate = this.focusEngagement.earlyInnovationProjectData.contract.signingDate;
                    let signingDateValid = false;
                    let targetDateValid = false;

                    /*       alert(signingDate);*/

                    // first, check to see if the signing date is valid.
                    if (Object.prototype.toString.call(signingDate) === "[object Date]") {
                        // it is a date
                        signingDateValid = !isNaN(signingDate.getTime());
                    }
                    else {
                        // not a date
                        signingDateValid = false;
                        /*             alert("signing date Not a date object");*/
                    }


                    //loop through all payments and set their relative date
                    if (this.paymentSchedule.length > 0) {

                        for (let i = 0; i < this.paymentSchedule.length; ++i) {

                            if (!signingDateValid) {
                                this.paymentSchedule[i].relativeTime = "? (No contract signing date)";

                            }
                            else {

                                let targetDate = this.paymentSchedule[i].targetDate;

                                // check to see if the target date is valid.
                                if (Object.prototype.toString.call(targetDate) === "[object Date]") {
                                    // it is a date
                                    if (isNaN(targetDate.getTime())) {
                                        // date is not valid
                                        targetDateValid = false;
                                        this.paymentSchedule[i].relativeTime = "Target Date not Specified"

                                    }
                                    else {
                                        // Signing date is valid
                                        targetDateValid = true;
                                        /* alert("Target Date Valid!");*/
                                    }
                                }
                                else {
                                    // not a date
                                    targetDateValid = false;
                                    this.paymentSchedule[i].relativeTime = "Target Date not Specified"

                                }

                                //if both dates valid, do the calculation.  Note constants are defined at top of this file.


                                if (targetDateValid && signingDateValid) {
                                    let targetDateMS = targetDate.getTime();
                                    let signingDateMS = signingDate.getTime();

                                    if (targetDateMS - signingDateMS < 0) {
                                        this.paymentSchedule[i].relativeTime = 'Warning: Target Date is Before Signing Date!';

                                    }
                                    else {


                                        let relativeTimeMS = targetDateMS - signingDateMS;

                                        if (relativeTimeMS === 0)
                                            this.paymentSchedule[i].relativeTime = "T (due at signing)";
                                        else
                                            switch (this.options.relativeDateUnit) {
                                                case 'days':
                                                    this.paymentSchedule[i].relativeTime = "T+ " + Math.round(relativeTimeMS / ONE_DAY) + " days";
                                                    break;

                                                case 'weeks':
                                                    this.paymentSchedule[i].relativeTime = "T+" + Math.round(relativeTimeMS / ONE_WEEK) + " weeks";
                                                    break;

                                                case 'months':
                                                    this.paymentSchedule[i].relativeTime = "T+" + Math.round(relativeTimeMS / ONE_MONTH) + " months";
                                                    break;

                                                default:
                                                    this.paymentSchedule[i].relativeTime = "Relative time unit undefined. Check options."

                                            }
                                    }
                                }
                            }
                        } //for
                    }// if paymentSchedule
                    this.updatePaymentSchedule();
                } // if dateCalculation = specific
            };


            /***************************************************************************************************
             * calculateTargetDates
             * Internal function that calculates the relative time given signing date and target date.
             * Returns a notifier string if target happens after sigining or no signing date.
             * Note that this pulls the "relativeUnit" from the options of the paymentSchedule e.g. weeks, vs. months
             ****************************************************************************************************/

            this.calculateTargetDates = function () {

                if (this.options.dateCalculation === "relative") {


                    let signingDate = this.focusEngagement.earlyInnovationProjectData.contract.signingDate;
                    let signingDateValid = false;
                    let relativeTimeValid = false;
                    let targetDateMS = 0;


                    /*       alert(signingDate);*/

                    // first, check to see if the signing date is valid.
                    if (Object.prototype.toString.call(signingDate) === "[object Date]") {
                        // it is a date
                        if (isNaN(signingDate.getTime())) {
                            // date is not valid
                            signingDateValid = false;

                        }
                        else {
                            // Signing date is valid
                            /* alert("Signing Date Valid!!!");*/
                            signingDateValid = true;
                        }
                    }
                    else {
                        // not a date
                        signingDateValid = false;

                    }


                    //loop through all payments and set their relative date
                    if (this.paymentSchedule.length > 0) {
                        for (let i = 0; i < this.paymentSchedule.length; ++i) {
                            if (!signingDateValid) {
                                this.paymentSchedule[i].targetDate = "? (No contract signing date)";

                            }
                            else {

                                let relativeTime = this.paymentSchedule[i].relativeTime;
                                /*                                alert('RelativeTime:' + relativeTime);
                                 alert('NAN?: ' + isNaN(relativeTime));*/

                                // check to see if the target date is valid.
                                if (isNumber(relativeTime))
                                    relativeTimeValid = true;
                                else {
                                    relativeTimeValid = false;

                                    this.paymentSchedule[i].targetDate = "Relative Date not Specified";
                                }


                                if (relativeTimeValid && signingDateValid) {
                                    /*alert('calc targetDate');*/
                                    let signingDateMS = signingDate.getTime();
                                    let targetDateMS = 0;

                                    switch (this.options.relativeDateUnit) {
                                        case 'days':
                                            targetDateMS = signingDateMS + (relativeTime * ONE_DAY);
                                            this.paymentSchedule[i].targetDate = new Date(targetDateMS);
                                            break;

                                        case 'weeks':
                                            targetDateMS = signingDateMS + (relativeTime * ONE_WEEK);
                                            this.paymentSchedule[i].targetDate = new Date(targetDateMS);
                                            break;

                                        case 'months':
                                            targetDateMS = signingDateMS + (relativeTime * ONE_MONTH);
                                            this.paymentSchedule[i].targetDate = new Date(targetDateMS);
                                            break;

                                        default:
                                            this.paymentSchedule[i].targetDate = "Relative time unit undefined. Check options."
                                    } // switch
                                } //if target date and signing date valid
                            } // else sigining date valid
                        } //for
                    }// if paymentSchedule

                    this.updatePaymentSchedule();
                } // if dateCalculation = relative
            };


            /***************************************************************************************************
             * calculatePaymentFromPercentage
             * Calculates the actual payment from a percentage.
             ****************************************************************************************************/

            this.calculatePaymentFromPercentage = function () {

                if (this.options.paymentCalculation === "percentage") {

                    let contractValue = this.focusEngagement.earlyInnovationProjectData.contract.contractValue;
                    let contractValueValid = false;  //Is contract value
                    let percentage = null;

                    // is the value valid
                    contractValueValid = isNumber(contractValue);

                    if (this.paymentSchedule.length > 0) {
                        for (let i = 0; i < this.paymentSchedule.length; ++i) {
                            if (!contractValueValid)
                                this.paymentSchedule[i].paymentAmount = "Contract Amount not specified.";
                            else {
                                // check to see if the target date is valid.
                                if (isNumber(this.paymentSchedule[i].paymentPercentage))
                                    percentage = this.paymentSchedule[i].paymentPercentage / 100;

                                this.paymentSchedule[i].paymentAmount = Math.round(percentage * contractValue);

                            }
                        }
                    }
                }// if paymentSchedule

                this.updatePaymentSchedule();

            };

            /***************************************************************************************************
             * calculatePercentageFromPayment
             * Calculates the actual payment from a percentage.
             ****************************************************************************************************/

            this.calculatePercentageFromPayment = function () {

                if (this.options.paymentCalculation === "specific") {

                    let contractValue = this.focusEngagement.earlyInnovationProjectData.contract.contractValue;
                    let contractValueValid = isNumber(contractValue);
                    let percentage = null;


                    if (this.paymentSchedule.length > 0) {
                        for (let i = 0; i < this.paymentSchedule.length; ++i) {
                            if (!contractValueValid)
                                this.paymentSchedule[i].paymentPercentage = "Contract Amount not specified.";
                            else {
                                // check to see if the target date is valid.
                                if (isNumber(this.paymentSchedule[i].paymentAmount))
                                    percentage = this.paymentSchedule[i].paymentAmount / contractValue;

                                this.paymentSchedule[i].paymentPercentage = Math.round(percentage * 100);

                            }

                        }
                    }
                }

                this.updatePaymentSchedule();

            };


            /***************************************************************************************************
             * updatePaymentSchedule
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.updatePaymentSchedule = function () {

                this.call("engagementUpdateEIPaymentSchedule", this.focusEngagementId, angular.copy(this.paymentSchedule));

            };

            /***************************************************************************************************
             * updatePaymentOptions
             * Commits updated client payment options to server
             ****************************************************************************************************/

            this.updatePaymentOption = function (field, value) {
                this.call("engagementUpdateEIPaymentOption", this.focusEngagementId, field, value);
            };

            /***************************************************************************************************
             * updateRelativeDateUnit
             * Commits updated client payment options to server
             ****************************************************************************************************/

            this.updateRelativeDateUnit = function (field, value) {
                this.call("engagementUpdateEIPaymentOption", this.focusEngagementId, field, value, (err, result) =>{
                    if (err)
                        alert("Error updating payment option.")
                    else {
                        this.calculateTargetDates();
                    }
                });

            };


            /***************************************************************************************************
             * updateContractData
             * Updates the signing date on the main engagement.
             ****************************************************************************************************/
            this.updateContractData = function () {

                /* alert("update contract data - client");*/
                this.call("engagementUpdateEIContractData", this.focusEngagementId, angular.copy(this.focusEngagement.earlyInnovationProjectData.contract));

            };

            /***************************************************************************************************
             * cancelPaymentScheduleChanges
             * Restores server side settings to client and turns of editng
             ****************************************************************************************************/

            this.cancelPaymentScheduleChanges = function () {

                this.ui.editPaymentSchedule = false; // turn off the editing UI
                this.focusEngagement = Engagements.findOne(this.focusEngagementId);  // trigger helper watch to update from server

            };

            /***************************************************************************************************
             * updateSigningDate
             * Updates the signing date on the agreement and checks relative calculations.
             ****************************************************************************************************/
            /*todo: complete this*/
            this.updateSigningDate = function () {

                /* alert ('update signing date');*/
                /*alert ('after if');*/
                this.updateContractData();


                // if specific dates determined, calculate the relative dates.
                if (this.options.dateCalculation === 'specific')
                    this.calculateRelativeTimes();
                else if (this.options.dateCalculation === 'relative')
                    this.calculateTargetDates();


            };

            /***************************************************************************************************
             * updateRelativeTime
             * Updates the relative time on the server and calculates the target date
             ****************************************************************************************************/

            this.updateRelativeTime = function () {

                /* alert ('update signing date');*/

                if (this.options.dateCalculation === "relative")
                    this.calculateTargetDates();


                this.updatePaymentSchedule();

            };

            /***************************************************************************************************
             * updateContractValue
             * Updates deal value and recalculates appropriate amounts
             ****************************************************************************************************/

            this.updateContractValue = function () {

                /* alert ('update signing date');*/

                if (isNumber(this.focusEngagement.earlyInnovationProjectData.contract.contractValue)) {
                    if (this.options.paymentCalculation === "percentage")
                        this.calculatePaymentFromPercentage();
                    else if (this.options.paymentCalculation === "specific")
                        this.calculatePercentageFromPayment();

                    this.updateContractData();
                    this.updatePaymentSchedule();
                }
            };


            /***************************************************************************************************
             * formattedCurrencyValue
             * Returns an numeric value formatted as a currency
             ****************************************************************************************************/
            this.formattedCurrencyValue = function (value) {
                if (isNumber(value)) {
                    let fdl = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return "$" + fdl;
                } else
                    return "-?-"
            };


            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


