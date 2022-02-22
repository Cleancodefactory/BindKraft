
(function() {


    /**
     * The usage of state serializers depends on additional knowledge about the media they support. This cannot be 
     * programmatically determined easily and any protocol intended to do that will be too complex to implement for 
     * both sides.
     * 
     * So this interface defines just the function prototypes needed to cover all those variations, but has no means to detect the 
     * specific behavior of the serializer.
     * For example: A serializer can serialize directly to BkUrl. This by itself makes convenient to add the serialized data to an existing URL
     * Another example: A serializer putting the data into a string for non-URL usage can simply return the result
     */
    function ITreeStatesSerializer() {}
    ITreeStatesSerializer.Interface("ITreeStatesSerializer");

    ITreeStatesSerializer.prototype.parseToLinear = function(input, options) { throw "not implemented"; }
    ITreeStatesSerializer.prototype.encodeFromLinear = function(base, linear) { throw "not implemented"; }


})();