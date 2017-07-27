/**
 * Created by Alex on 12/11/16.
 */











miz.filter('filingStatus', function(status) {
    return function(x) {
     return  _.where(x, {filingStatus: status})
    };
});

miz.filter('engType', function(type) {
    return function(x) {
        return  _.where(x, {filingStatus: type})
    };
});