(function() {
    function IAjaxSendQueue() {}
    IAjaxSendQueue.Inteface("IAjaxSendQueue");

    IAjaxSendQueue.prototype.enqueueRequest = function(req, priority) { throw "not impl.";}
    IAjaxSendQueue.prototype.dequeueRequest = function(priority) { throw "not impl.";}

    IAjaxSendQueue.prototype.pickRequest = function(callback) { throw "not impl.";}
})();