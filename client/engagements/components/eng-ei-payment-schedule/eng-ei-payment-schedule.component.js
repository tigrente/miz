/*********************************************************************************************************
 * <eng-ei-payment-schedule>
 *     This directive is for displaying and editing early innovation payment schedules
 *********************************************************************************************************/


miz.directive("engEiPaymentSchedule", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-payment-schedule/eng-ei-payment-schedule.ng.html',
        controllerAs: 'eips',
        scope: true,
        bindToController: {
            focusEngagement: "="
        },

        controller: function ($scope, $reactive, $state) {


            $reactive(this).attach($scope);

            /** Initialize **/

            const ONE_DAY = 1000 * 60 * 60 * 24;    //Get 1 day in milliseconds
            const ONE_WEEK = ONE_DAY * 7;           //Get 1 week in milliseconds
            const ONE_MONTH = ONE_DAY * 30.42;      //Get about 1 month in milliseconds

            //Ensure that early innovation data is attached to engagement object


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
                paymentCalculation: 'specific',
                additionalFinalAcceptance: false
            };


            //ui helpers
            this.ui = {
                editPaymentSchedule: false,  //true for development, otherwise should be false
                relativeDates: true,
            };

            this.newPaymentSchedule = 'initializing';


/*            if (this.focusEngagement) {

                //Check for earlyInnovationData - initialize if nothing there
                if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                    this.call("engagementInitializeEarlyInnovationProjectData", this.focusEngagement._id, (err, result) => {
                        if (err)
                            alert("Something went wrong: " + err);
                        else
                            $route.reload(); //reload the controller after the change
                    });
                } else {


                    this.initializer.dealValue = this.focusEngagement.dealValue;

                    // if no payment schedule, enable the editing window
                    if (thia.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length === 0)
                        this.ui.editPaymentSchedule = true;

                }
            }*/


            /** HELPERS **/
            this.helpers({


                // get current engagement
              /*  focusEngagement: () => {
                    this.getReactively('focusEngagementId');

                    //alert(this.focusEngagementId);

                    if (this.focusEngagementId) {

                        let focusEngagement = Engagements.findOne(this.focusEngagementId);

                        //Check for earlyInnovationData - initialize if nothing there
                        if (!focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                            this.call("engagementInitializeEarlyInnovationProjectData", this.focusEngagementId, (err, result) => {
                                if (err)
                                    alert("Something went wrong: " + err);
                                else
                                    $route.reload(); //reload the controller after the change
                            });
                        } else {

                            // if no payment schedule, enable the editing window
                            this.initializer.dealValue = focusEngagement.dealValue;

                            if (focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length === 0)
                                this.ui.editPaymentSchedule = true;

                        }

                        return Engagements.findOne(this.focusEngagementId);

                    } //if

                },*/


            });


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
             * formattedDealValue
             * Returns the contract value in a nice format
             ****************************************************************************************************/
            this.formattedDealValue = function () {
                if (this.focusEngagement.earlyInnovationProjectData.contract.contractValue) {
                    let fdl = this.focusEngagement.earlyInnovationProjectData.contract.contractValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return "$" + fdl;

                } else return "Click to enter value...";
            }; //formattedDealValue

            /***************************************************************************************************
             * unallocatedPercentage
             * Returns the percentage of the contract value not yet allocated to the payment schedule.
             ****************************************************************************************************/

            this.unallocatedPercentage = function () {

                if (!this.focusEngagement.earlyInnovationProjectData.contract.contractValue)
                    return "Total contract value not defined";
                else {
                    let allocation = 0;  // the amount of percentage already allocationd
                    for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i)
                        allocation += this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentPercentage;

                    return 100 - allocation;


                }

            };

            /***************************************************************************************************
             * unallocatedAmount
             * Returns the amount of the contract that has not yet been allocated to the payment schedule
             ****************************************************************************************************/

            this.unallocatedAmount = function () {

                if (!this.focusEngagement.earlyInnovationProjectData.contract.contractValue)
                    return "Total contract value not defined";
                else {
                    let allocation = 0;  // the amount of percentage already allocationd
                    for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i)
                        allocation += this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentAmount;

                    return this.focusEngagement.earlyInnovationProjectData.contract.contractValue - allocation;


                }

            };

            /***************************************************************************************************
             * scheduleComplete
             * Returns true if every payment has a scheduled date and no issues.
             ****************************************************************************************************/

            this.scheduleComplete = function () {

                this.getReactively("paymentSchedule", true);

                let complete = true;
                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule) {


                    for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i) {
                        // check to see if the target date is valid.
                        if (Object.prototype.toString.call(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate) === "[object Date]") {
                            // it is a date
                            if (isNaN(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate.getTime())) {
                                // date is not valid
                                complete = false;
                            }
                        }
                        else
                        // not a date
                            complete = false;

                    }//for

                    //do check on final payment

                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.additionalFinalAcceptance) {


                        if (Object.prototype.toString.call(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate) === "[object Date]") {
                            // it is a date
                            if (isNaN(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate.getTime())) {
                                // date is not valid
                                complete = false;
                            }


                        }
                        else
                            complete = false;
                    }

                    return complete;
                }
            };  //scheduleComplete*/

            /***************************************************************************************************
             * isNumber
             * Returns true if the object is a number, either in string or number form.
             ****************************************************************************************************/

            this.isNumber = function isNumber(obj) {
                return !isNaN(parseFloat(obj))
            };

            /***************************************************************************************************
             * updatePaymentTargetDate
             * Takes index of payment from focus engagement.
             * Updates the actual schedule and calculates the relative schedule.  Should only be called in "specific"
             * date option is active.
             ****************************************************************************************************/
            this.updatePaymentTargetDate = function () {

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === "specific")
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

                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule = [];

                for (let i = 0; i < this.initializer.numberOfPayments; ++i) {
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.push(paymentTemplate);

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


                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.push(paymentTemplate);
                this.updatePaymentSchedule();

                /*this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(newPaymentSchedule));*/


            };

            /***************************************************************************************************
             * removePaymentPayment
             * Accepts index of payment to be removed from os.
             ****************************************************************************************************/

            this.removePayment = function (index) {

                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.splice(index, 1);

                this.updatePaymentSchedule();

                /* this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(newPaymentSchedule));*/


            };


            /***************************************************************************************************
             * calculateRelativeTimes
             * Internal function that calculates the relative time given signing date and target date.
             * Returns a notifier string if target happens after sigining or no signing date.
             * Note that this pulls the "relativeUnit" from the options of the paymentSchedule e.g. weeks, vs. months
             ****************************************************************************************************/

            this.calculateRelativeTimes = function () {

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === "specific") {
//alert("calc relative times");

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

//alert("signging date valid: " + signingDateValid);
                    //loop through all payments and set their relative date
                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length > 0) {

                        for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i) {

                            if (!signingDateValid) {
                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = "? (No contract signing date)";

                            }
                            else {

                                let targetDate = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate;

                                // check to see if the target date is valid.
                                if (Object.prototype.toString.call(targetDate) === "[object Date]") {
                                    // it is a date
                                    if (isNaN(targetDate.getTime())) {
                                        // date is not valid
                                        targetDateValid = false;
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = "Target Date not Specified"

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
                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = "Target Date not Specified"

                                }

                                //if both dates valid, do the calculation.  Note constants are defined at top of this file.


                                if (targetDateValid && signingDateValid) {
                                    let targetDateMS = targetDate.getTime();
                                    let signingDateMS = signingDate.getTime();

                                    if (targetDateMS - signingDateMS < 0) {
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = 'Warning: Target Date is Before Signing Date!';

                                    }
                                    else {


                                        let relativeTimeMS = targetDateMS - signingDateMS;

                                        if (relativeTimeMS === 0)
                                            this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = "T (due at signing)";
                                        else
                                            switch (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.relativeDateUnit) {
                                                case 'days':
                                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = Math.round(relativeTimeMS / ONE_DAY);
                                                    break;

                                                case 'weeks':
                                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = Math.round(relativeTimeMS / ONE_WEEK);
                                                    break;

                                                case 'months':
                                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = Math.round(relativeTimeMS / ONE_MONTH);
                                                    break;

                                                default:
                                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime = "Relative time unit undefined. Check options."

                                            }

                                    }
                                }
                            }
                        } //for

                        //Now calculate relative date for final acceptance

                        if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.additionalFinalAcceptance) {

                            if (!signingDateValid)
                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = "? (No contract signing date)";
                            else {

                                let targetDate = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate;

                                // check to see if the target date is valid.
                                if (Object.prototype.toString.call(targetDate) === "[object Date]") {
                                    // it is a date
                                    if (isNaN(targetDate.getTime())) {
                                        // date is not valid
                                        targetDateValid = false;
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = "Target Date not Specified"
                                    }
                                    else
                                    // Signing date is valid
                                        targetDateValid = true;
                                }
                                else {
                                    // not a date
                                    targetDateValid = false;
                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = "Target Date not Specified"
                                }

                                //if both dates valid, do the calculation.  Note constants are defined at top of this file.


                                if (targetDateValid && signingDateValid) {
                                    let targetDateMS = targetDate.getTime();
                                    let signingDateMS = signingDate.getTime();

                                    if (targetDateMS - this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length - 1].targetDate < 0)
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = 'Warning: Final Acceptance Date is before final payment.';
                                    else {

                                        let relativeTimeMS = targetDateMS - signingDateMS;

                                        switch (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.relativeDateUnit) {
                                            case 'days':
                                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = Math.round(relativeTimeMS / ONE_DAY);
                                                break;

                                            case 'weeks':
                                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = Math.round(relativeTimeMS / ONE_WEEK);
                                                break;

                                            case 'months':
                                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = Math.round(relativeTimeMS / ONE_MONTH);
                                                break;

                                            default:
                                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime = "Relative time unit undefined. Check options.";

                                        }
                                    }
                                }
                            }
                        } //for
                    }// if paymentSchedule
                    this.updatePaymentSchedule();
                    this.updateAdditionalFinalAcceptance('relativeTime', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime);
                    this.updateAdditionalFinalAcceptance('targetDate', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate);

                } // if dateCalculation = specific
            };


            /***************************************************************************************************
             * calculateTargetDates
             * Internal function that calculates the relative time given signing date and target date.
             * Returns a notifier string if target happens after sigining or no signing date.
             * Note that this pulls the "relativeUnit" from the options of the paymentSchedule e.g. weeks, vs. months
             ****************************************************************************************************/

            this.calculateTargetDates = function () {

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === "relative") {

                    let signingDate = this.focusEngagement.earlyInnovationProjectData.contract.signingDate;
                    let signingDateValid = false;
                    let relativeTimeValid = false;
                    let targetDateMS = 0;


                    /*       alert(signingDate);*/

                    // first, check to see if the signing date is valid.
                    if (Object.prototype.toString.call(signingDate) === "[object Date]") {
                        // it is a date
                        signingDateValid = !isNaN(signingDate.getTime());
                    }
                    else {
                        // not a date
                        signingDateValid = false;

                    }


                    //loop through all payments and set their relative date
                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length > 0) {
                        for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i) {
                            if (!signingDateValid) {
                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = "? (No contract signing date)";
                            }
                            else {

                                let relativeTime = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].relativeTime;

                                // check to see if the target date is valid.
                                if (this.isNumber(relativeTime))
                                    relativeTimeValid = true;
                                else {
                                    relativeTimeValid = false;
                                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = "Relative Date not Specified ";
                                }


                                if (relativeTimeValid && signingDateValid) {
                                    /*alert('calc targetDate');*/
                                    let signingDateMS = signingDate.getTime();
                                    let targetDateMS = 0;

                                    switch (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.relativeDateUnit) {
                                        case 'days':
                                            targetDateMS = signingDateMS + (relativeTime * ONE_DAY);
                                            this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = new Date(targetDateMS);
                                            break;

                                        case 'weeks':
                                            targetDateMS = signingDateMS + (relativeTime * ONE_WEEK);
                                            this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = new Date(targetDateMS);
                                            break;

                                        case 'months':
                                            targetDateMS = signingDateMS + (relativeTime * ONE_MONTH);
                                            this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = new Date(targetDateMS);
                                            break;
                                        default:
                                            this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = "Relative time unit undefined. Check options."
                                    } // switch

                                    if (targetDateMS < signingDateMS)
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate = "Error: Target date is before signing date.";


                                } //if target date and signing date valid
                            } // else sigining date valid
                        } //for
                    }// if paymentSchedule

                    //Update additional final Acceptance Report

                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.additionalFinalAcceptance) {

                        if (!signingDateValid) {
                            this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate = "? (No contract signing date)";
                        }
                        else {

                            let relativeTime = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime;

                            // check to see if the target date is valid
                            if (this.isNumber(relativeTime))
                                relativeTimeValid = true;
                            else {
                                relativeTimeValid = false;
                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate = "?";
                            }


                            if (relativeTimeValid && signingDateValid) {
                                /*alert('calc targetDate');*/

                                let targetDateMS;
                                let signingDateMS = signingDate.getTime();

                                switch (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.relativeDateUnit) {
                                    case 'days':
                                        targetDateMS = signingDateMS + (relativeTime * ONE_DAY);
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate = new Date(targetDateMS);
                                        break;

                                    case 'weeks':
                                        targetDateMS = signingDateMS + (relativeTime * ONE_WEEK);
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate = new Date(targetDateMS);
                                        break;

                                    case 'months':
                                        targetDateMS = signingDateMS + (relativeTime * ONE_MONTH);
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate = new Date(targetDateMS);
                                        break;

                                    default:
                                        this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate = "Relative time unit undefined. Check options."
                                } // switch
                            } //if target date and signing date valid
                        } // else sigining date valid

                    }// if paymentSchedule

                    this.updatePaymentSchedule();
                    this.updateAdditionalFinalAcceptance('targetDate', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate);
                    this.updateAdditionalFinalAcceptance('relativeTime', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.relativeTime);
                } // if dateCalculation = relative
            };


            /***************************************************************************************************
             * calculatePaymentFromPercentage
             * Calculates the actual payment from a percentage.
             ****************************************************************************************************/

            this.calculatePaymentFromPercentage = function () {

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation === "percentage") {

                    let contractValue = this.focusEngagement.earlyInnovationProjectData.contract.contractValue;
                    let contractValueValid = false;  //Is contract value
                    let percentage = null;

                    // is the value valid
                    contractValueValid = this.isNumber(contractValue);

                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length > 0) {
                        for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i) {
                            if (!contractValueValid)
                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentAmount = "Contract Amount not specified.";
                            else {
                                // check to see if the target date is valid.
                                if (this.isNumber(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentPercentage))
                                    percentage = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentPercentage / 100;

                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentAmount = Math.round(percentage * contractValue);

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

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation === "specific") {

                    let contractValue = this.focusEngagement.earlyInnovationProjectData.contract.contractValue;
                    let contractValueValid = this.isNumber(contractValue);
                    let percentage = null;


                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length > 0) {
                        for (let i = 0; i < this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i) {
                            if (!contractValueValid)
                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentPercentage = "Contract Amount not specified.";
                            else {
                                // check to see if the target date is valid.
                                if (this.isNumber(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentAmount))
                                    percentage = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentAmount / contractValue;

                                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].paymentPercentage = Math.round(percentage * 100);

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

                this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule));

            };


            this.updatePaymentScheduleElement = function (index, field, value) {
                this.call("engagementUpdateEIPaymentOption", this.focusEngagement._id, field, value);
            };

            /***************************************************************************************************
             * updatePaymentOptions
             * Commits updated client payment options to server
             ****************************************************************************************************/

            this.updatePaymentOption = function (field, value) {
                this.call("engagementUpdateEIPaymentOption", this.focusEngagement._id, field, value);
            };

            /***************************************************************************************************
             * updatePaymentOptions
             * Commits updated client payment options to server
             ****************************************************************************************************/

            this.updateAdditionalFinalAcceptance = function (field, value) {
                this.call("engagementUpdateEIAdditionalFinalAcceptance", this.focusEngagement._id, field, value);
            };


            /***************************************************************************************************
             * updateRelativeDateUnit
             * Commits updated client payment options to server
             ****************************************************************************************************/

            this.updateRelativeDateUnit = function () {
                this.call("engagementUpdateEIPaymentOption", this.focusEngagement._id, 'relativeDateUnit', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.relativeDateUnit);

                let method = this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.relativeDateUnit;

                if (method === 'relative')
                    this.calculateTargetDates();
                else
                    this.calculateRelativeTimes();
            };


            /***************************************************************************************************
             * updateContractData
             * Updates the signing date on the main engagement.
             ****************************************************************************************************/
            this.updateContractData = function () {

                /* alert("update contract data - client");*/
                this.call("engagementUpdateEIContractData", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.contract));

            };

            /***************************************************************************************************
             * cancelPaymentScheduleChanges
             * Restores server side settings to client and turns of editng
             ****************************************************************************************************/

            this.cancelPaymentScheduleChanges = function () {

                this.ui.editPaymentSchedule = false; // turn off the editing UI
                this.focusEngagement = Engagements.findOne(this.focusEngagement._id);  // trigger helper watch to update from server

            };

            /***************************************************************************************************
             * updateSigningDate
             * Updates the signing date on the agreement and checks relative calculations.
             ****************************************************************************************************/
            /*todo: complete this*/
            this.updateSigningDate = function () {

                this.updateContractData();

                // if specific dates determined, calculate the relative dates.
                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === 'specific')
                    this.calculateRelativeTimes();
                else if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === 'relative')
                    this.calculateTargetDates();
            };


            /***************************************************************************************************
             * updateRelativeTime
             * Updates the relative time on the server and calculates the target date
             ****************************************************************************************************/

            this.updateRelativeTime = function () {

                /* alert ('update signing date');*/

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === "relative")
                    this.calculateTargetDates();

            };

            /***************************************************************************************************
             * updateContractValue
             * Updates deal value and recalculates appropriate amounts
             ****************************************************************************************************/

            this.updateContractValue = function () {

                /* alert ('update signing date');*/

                if (this.isNumber(this.focusEngagement.earlyInnovationProjectData.contract.contractValue)) {

                    this.updateContractData();

                    if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation === "percentage")
                        this.calculatePaymentFromPercentage();
                    else if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation === "specific")
                        this.calculatePercentageFromPayment();


                }
            };


            /***************************************************************************************************
             * formattedCurrencyValue
             * Returns an numeric value formatted as a currency
             ****************************************************************************************************/
            this.formattedCurrencyValue = function (value) {
                if (this.isNumber(value)) {
                    let fdl = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return "$" + fdl;
                } else
                    return "-?-"
            };


            /***************************************************************************************************
             * toggleDateCalculationOption
             * Toggles date calculation from relative to specific, and vice-versa
             ****************************************************************************************************/
            this.toggleDateCalculationOption = function () {
                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation === 'specific')
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation = 'relative';
                else
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation = 'specific';

                this.call('engagementUpdateEIPaymentOption', this.focusEngagement._id, 'dateCalculation', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation);

            };

            /***************************************************************************************************
             * togglePaymentCalculationOption
             * Toggles payment calculation from percentage to specific, and vice-versa
             ****************************************************************************************************/
            this.togglePaymentCalculationOption = function () {
                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation === 'specific')
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation = 'percentage';
                else
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.dateCalculation = 'specific';

                this.call('engagementUpdateEIPaymentOption', this.focusEngagement._id, 'paymentCalculation', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.paymentCalculation);

            };

            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


