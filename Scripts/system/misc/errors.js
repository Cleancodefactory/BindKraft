
class RouteException extends Error {
    /**
     *
     */
    constructor(message = "Error", cause = null) {
        super(message, { cause: cause });
        
    }
}

class RouteBounceBack extends RouteException {
    /**
     *
     */
    constructor(message,cause = null) {
        super(message,cause);
    }
}
class RouteGoRoot extends RouteException {
    /**
     *
     */
    constructor(message,cause) {
        super(message,cause);
        
    }
}