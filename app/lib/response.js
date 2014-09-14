var _ = require('lodash');

module.exports = function(response){
    this.response = response;
    
    var defaultSchema = {
        error: false
    };
    
    this.data = function(data){
        var data = data || [];
        
        var res = _.extend({
            data: data
        }, defaultSchema);
        
        this.response.json(res);
    };
    
    this.error = function(message){
        var msg = message || "Sorry! something wen't wrong";
        
        var res = _.extend(defaultSchema, {
            error: true,
            message: msg
        });
        
        this.response.status(400).json(res);
    };
    
    return this;
};