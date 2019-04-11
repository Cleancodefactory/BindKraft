/* Daemons manager implementation

	This implementer does not have specific requirements, but may get some in future.
	It is intended for implementation by the system, apps and possibly daemons.
	The system should have only one daemon manager, others can be implemented by some 
	apps that need its own set of ones.

*/
// import {DaemonRegisterItem} from '../misc/DaemonRegisterItem.js';

function IDaemonManagerImpl() {}
IDaemonManagerImpl.InterfaceImpl(IDaemonManager);
IDaemonManagerImpl.classInitialize = function (cls) {

    cls.prototype.$appmgr_lastid = 0;
    cls.ImplementActiveIndexedProperty("activedaemons", new InitializeArray("A register for the running daemons"));
    cls.prototype.$instanceByName = function (name) {
        return this.get_activedaemons().FirstOrDefault(function (idx, item) {
            if (item.get_instancename() == name) return item;
            return null;
        });
    }
    cls.prototype.$instanceById = function (id) {
        return this.get_activedaemons().FirstOrDefault(function (idx, item) {
            if (item.get_instanceid() == name) return item;
            return null;
        });
    }
    cls.prototype.$instanceByClass = function (cls, noname) { // cls - classname, noname - if true among the unnamed only
        return this.get_activedaemons().FirstOrDefault(function (idx, item) {
            if (BaseObject.is(item.cls)) {
                if (noname) {
                    if (typeof item.get_instancename() == "string") return null;
                }
                return item;
            }
            return null;
        });
    }.Description("Internal. Searches for active instance of the given class by class")
        .Param("noname", "Boolean, optional - if true only among the unnamed daemons.");

    cls.prototype.$directClass = false; // Experimental - launch a class without consulting a register
    cls.prototype.$newInstanceId = function () {
        this.$appmgr_lastid++;
        return this.$appmgr_lastid;
    }
    cls.prototype.$add_activedaemon = function (name, v) {
        if (BaseObject.is(v, "IDaemonApp")) {
            v.set_instanceid(this.$newInstanceId());
            if (name != null && name.length > 0) c.set_instancename(name);
            // TODO: May be we should advise the demon about the manager that deals with it
            // TODO: Should we check more carefuly if the instance already exists.
            this.get_activedaemons().addElement(v);
        }
    }.Description("Internal. Adds a started daemon to the manager")
        .Param("name", "The name of the instance");
    cls.prototype.$removeByInstance = function (inst) {
        this.get_activedaemons().Delete(function (idx, item) {
            if (item == inst) return true;
            return null;
        });
    }
	/**
	 * Internal. Starts a daemon or finds out if it is already started.
	 * @param {string} name Can be null or a name of an instance (usually the alias from the register).
	 * @param {string} daemonClass The name of the daemon's class.
	 * @param {string} startParams The standard serialized form of parameters (the same as in data-class, but without bindings of course)
	 * @param {boolean} single Boolean, optional single instance mode.
	 * @desc The internal daemon starter/checker - all the arguments should be determined (extracted from register if neccessary - see startDaemon).
	 */
    cls.prototype.$startDaemon = function (name, daemonClass, startParams, single) { // name has to be extracted from a register
		/* Rules:
			name: - if nonempty
				returns 
					a) the existing instance if the name is there and the daemonClass matches the instance
					b) Launches an instance for the name
			name: null or empty
				finds current by class among the unnamed
				if found:
					if single is true - returns its ids
					else starts new one
				not found
					starts new one
		*/
        var op = new Operation();
        if (typeof daemonClass != "string") {
            // DaemonClass is required at this time (we can rethink this)
            op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.parameters));
            return op;
        }

        var currentInst = null;
        if (typeof name == "string" && name.length > 0) {
            currentInst = this.$instanceByName(name);
            if (BaseObject.is(currentInst, daemonClass)) {
                // already started
                // named daemons are always single instance
                op.CompleteOperation(true, currentInst.get_instanceid());
                return op;
            } else {
                if (currentInst != null) {
                    op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.exists_wrongtype));
                } else {
                    // goes to the launch section (see below)
                }
            }
        } else { // noname
            currentInst = this.$instanceByClass(daemonClass, true);
            if (BaseObject.is(currentInst, daemonClass) && single) {
                op.CompleteOperation(true, currentInst.get_instanceid());
                return op;
            }
        }
        // LAUNCH NEW
        // We have to create a new one
        currentInst = new Function.classes[daemonClass]();
        if (typeof startParams == "string") {
            try {
                JBUtils.parametrize.call(currentInst, null, null, startParams);
            } catch (ex) {
                op.CompleteOperation(false, IOperation.error(ex.description));
            }
        }
        this.$add_activedaemon(name, currentInst); // Register and start loading
        currentInst.appinitialize(function (success) {
            if (success) {
                // Call run and be done with it
                op.CompleteOperation(true, currentInst);
                currentInst.run();
            } else {
                // initialization failed - remove it
                this.$removeByInstance(currentInst);
                // call the appuninitialize and fail the operation
                currentInst.appuninitialize(function () {
                    // This is done after failing the operation if it is async
                    jbTrace.log("After failing to initialize the daemon " + daemonClass + " finished uninitialization.");
                });
                op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.initfailed));
            }
        }); // Arguments are not supported for now - use parameters instead
        return op;
    }
	/**
	 * @param {string} alias - the name in the register - the daemonClass is ignored and is obtained from the register
	 */
    cls.prototype.startDaemon = function (alias, daemonClass, parameters) {
        var op = new Operation();
        var daemonItem = null;
        var cls = null;
        var prm = parameters;
        if (this.$directClass && alias == null && daemonClass != null && daemonClass.length > 0) {
            cls = daemonClass;
            // prm is what comes as argument
        } else {
            var reg = this.$getRegister(); // as IDaemonRegister
            var dri; // as DaemonRegisterItem
            if (typeof alias == "string" && alias.length > 0) {
                dri = reg.item(alias, "alias"); // key, aspect: alias
                if (dri == null) {
                    op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.notfound));
                    return op;
                }
                cls = dri.get_daemonClass();
                if (prm == null) prm = dri.get_startParameters();
            } else if (typeof daemonClass == "string" && daemonClass.length > 0) {
                dri = reg.item(daemonClass, "class");
                if (dri == null) {
                    op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.notfound));
                    return op;
                }
                cls = dri.get_daemonClass();
                if (prm == null) prm = dri.get_startParameters();
            } else {
                op.CompleteOperation(false, IOperation.error("One of the both alias or daemonClass arguments must be non-empty string"));
                return op;
            }
        }
        // We know the cls (daemon's classname), prm - parameters if any nad the alias of course
        // We can try to start/connect to it
        op = this.$startDaemon(alias, cls, prm, single)
        // We no longer need the other operation - it was needed in order to generate the same kind of return result if problem occurs early
        return op;
    }.Returns("Operation")
        .Description("Initializes the daemon and completes the operation after that. The data in the completed operation is the id of the daemon");
    cls.prototype.GetDaemonServiceFactory = function (daemon_id, /*optional*/ proxybuilder) {
        var inst = this.$instanceById(daemon_id);
        if (inst != null) {

        }
        throw "Not implemented"
    }.Returns("Returns the service factory of the specified daemon (if one is supported, if not null is returned)");
    cls.prototype.shutdownDaemon = function (daemon_id) {
        throw "Not implemented";
    }.Returns("Operation with boolean result");
    cls.prototype.shutdownAllDaemons = function () {
        throw "Not implemented";
    }
    // Non-interface members
    cls.ImplementProperty("register", new Initialize("The register to use, can be null - then the default one is used.", null));
    cls.prototype.$getRegister = function () {
        var reg = this.get_register();
        if (!BaseObject.is(reg, "IDaemonRegister")) {
            if (reg == null) {
                // Find the default
                var dr = Registers.Default().getRegister("daemonRegister");
                if (BaseObject.is(dr, "IDaemonRegister")) {
                    reg = dr;
                } else {
                    throw "The system daemon register is not configured. In the boot process (see $SysBoot) there must be a step where the register has to be registered with the system Registers e.g. Registers.Default().addRegsiter(new DaemonRegister()) with some daemon registrations passed to the DaemonRegister."
                }
            } else {
                throw "get/set_register must be set to the instance of an IDaemonRegister or to null if the global register has to be used";
            }
        }

    }
};