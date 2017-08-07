/** This is the main app declaration for miz, including all the components to be loaded with it. **/

import angularModalService from 'angular-modal-service';
import ngAnimate from 'angular-animate';
import d3 from 'd3';
import nvd3 from'nvd3';
import angularNvd3 from 'angular-nvd3';
//import ngTagsInput from 'ng-tags-input';
import jszip from 'jszip';
import doxctemplater from 'docxtemplater';




miz = angular.module('miz', [
    'angular-meteor',   //meteor package: angular
    //'angular-meteor-auth', // Angular-Meteor authentication module
    'ui.router',        //meteor package: angularui:angular-ui-router
    'xeditable',        //meteor package: vitalets:angular-xeditable
    'ui.bootstrap',     //meteor packages: twbs:bootstrap, angularui:angular-ui-bootstrap
    'ngDropzone',       //meteor package: tgienger:angular-dropzone
    'accounts.ui',       //meteor package: dotansimha:accounts-ui-angular
    'angularMoment',      //meteor package: jasonaibrahim:angular-moment  - anuglar Moment.js - date tools
    'infinite-scroll',   //meteor package netanelgilad:ng-infinite-scroll,
    'froala',             // WYSIWYG HTML EDITOR - plays nicer with Outlook
    'angularModalService',
    'ngAnimate',
    'sticky',
    'nvd3',
    'ngTagsInput'

]).value('froalaConfig', {
    inlineMode: false,
    placeholder: 'Enter Text Here'
});


// Initialize Event Hooks - Meteor Smart Package
miz.run(function () {
        Hooks.init()
    }
);

/*// This is an attempt to fix the issue where engagements doesn't load w/o app refresh
 miz.run(function($rootScope) {
 $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
 if (toState.name === "engagements") {
 // The initial transition comes from "root", which uses the empty string as a name.
 $route.reload();

 }
 });
 });*/


miz.run(function ($rootScope, $location, $state) {
    $rootScope.isAdmin = function () {
        return Roles.userIsInRole($rootScope.currentUser, 'superAdmin');
    };

    $rootScope.isViewEngagements = function () {
        return Roles.userIsInRole($rootScope.currentUser, 'viewEngagements');
    };

    $rootScope.isEditEngagements = function () {
        return Roles.userIsInRole($rootScope.currentUser, 'editEngagements');
    };


    $rootScope.menuSearchString = "";

    $rootScope.showSearchResults = function (searchString) {

        if(searchString.length > 2) {

            $rootScope.menuSearchString = searchString;
            $state.go('searchResults');

            $('nav a').parents('li,ul').removeClass('active');
        }
       /* $('.miz-search').removeClass('active');
        $rootScope.menuSearchString = '';*/

 /*       $('.miz-search').addClass('active');*/


    };


});

// xEditableOptions
miz.run(function (editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-xs';
    editableOptions.theme = 'bs3';
});






/*


 /!**********************************************************************
 * Engagement Filter Generation - This section sets up a collection of
 * angular filters that are used in the dashboard team summary.
 **********************************************************************!/
 miz.run(function () {

 let generateFilter = function (key, value) {

 miz.filter(key + '_' + value, function () {
 return function (x) {
 return _.where(x, {key: value})
 };
 })
 };

 let filingStatusValues = [
 'active',
 'executing',
 'on hold',
 'closed'
 ];

 let typeValues = [
 'Early Innovation',
 'Technical Cooperation',
 'Business Development',
 'Internal Project'
 ];

 for (let i = 0; i < filingStatusValues.length; i++) {
 generateFilter("filingStatus", filingStatusValues[i]);
 }

 for (let i = 0; i < filingStatusValues.length; i++) {
 generateFilter("type", typeValues[i]);
 }
 }
 );*/
