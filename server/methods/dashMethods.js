/**
 * Created by Alex on 11/14/16.
 */

/** Methods for generating data on the Dashboard **/


Meteor.methods({

    dashEngagementMetrics: function () {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'viewEngagements',
                    'editEngagements',
                    'editAllEngagements'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to view Engagement.")
        }

        var engagementMetrics = {};

        engagementMetrics.totalNumberOfEngagements = Engagements.find().count();


        /** EARLY INNOVATION METRICS **/

        //total number of early innovation projects
        selector = {"type" : 'Early Innovation'};
        engagementMetrics.totalNumberOfEarlyInnovationProjects = Engagements.find(selector).count();


        /** COOPERATION METRICS **/



        return engagementMetrics;

    },

    dashPartnerMetrics: function () {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'viewEngagements',
                    'editEngagements',
                    'editAllEngagements'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to view Engagement.")
        }

        var partnerMetrics = {};

        partnerMetrics.totalNumberOfPartners = Partners.find().count();


        /** EARLY INNOVATION METRICS **/




        /** COOPERATION METRICS **/



        return engagementMetrics;

    }

});