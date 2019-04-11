/**
	ToolTipWindow - shows a tool tip window in the desired placement
	Must be attached to the workspace window! If attached to anything else it will work only inside it.
	
*/

function ToolTipWindow(parentwnd, conf) {
	BaseObject.apply(this, arguments);
	this.configuration = conf;
	this.parentwnd = parentwnd;
}

ToolTipWindow.Inherit(BaseObject,"ToolTipWindow");
// ToolTipWindow.Implement(IPlatformUtilityImpl,"popdlgdev");

ToolTipWindow.prototype.configuration = null; // Holds the configuration
ToolTipWindow.prototype.parentwnd = null; // Holds the application reference while open
ToolTipWindow.prototype.placement = null; // Current placement, null menas default from config, nullified when tip expires
ToolTipWindow.prototype.tooltip = null; // holds the window instance while open
ToolTipWindow.prototype.element = null; // Element to which we need to stick
ToolTipWindow.prototype.userOp = null; // If active this is the operation given to the caller - must be cleared each time.
ToolTipWindow.prototype.$clearUserOp = function() {
	if (BaseObject.is(this.userOp,"Operation")) {
		if (!this.userOp.isOperationComplete()) {
			this.userOp.CompleteOperation(true,{}); // End it with success - for a tool tip errors are just for debugging, no one is going to use the tip closing for a serious things.
		}
	}
	this.userOp = null;
}

ToolTipWindow.prototype.innerOp = null; // Operation used during creation of a tip window otherwise kept null;

ToolTipWindow.prototype.isOpened = function() {
	return BaseObject.is(this.tooltip, "BaseWindow");
}.Description("Indicates if the tooltip window is created (usually true after the first use.");
ToolTipWindow.prototype.expire = function() {
	this.placement = null;
	this.element = null;
	if (BaseObject.is(this.tooltip,"BaseWindow")) {
		this.tooltip.setWindowStyles(WindowStyleFlags.visible,"reset");
	}
	if (this.innerOp != null) { // Clear any pesky innerOp if it exists (should not at this point - this is just in case solution)
		if (!this.innerOp.isOperationComplete()) this.innerOp.CompleteOperation(false,IOperation.errorname("unspecified"));
		this.innerOp = null;
	}
}.Description("The tip shown at the moment expires and the tooltip window hides, but remains ready for consequent usages.");
ToolTipWindow.prototype.$completeInnerOp = function(op) {
	
}
ToolTipWindow.prototype.showTip = function(el, tiptext) {
	var op = new ChunkedOperation();
	var innerOp = new Operation();
	
	// Create tooltip window id one does not exist or force completion of inner op if the innerOp exists, but the window is already open (clean the state - may be too much?)
	if (this.tooltip == null) { 
		this.innerOp = this.openTipWindow();
		innerOp = this.innerOp;
	} else {
		innerOp.completeOperation(true, {});
	}
	
	innerOp.then(this.thisCall(function(o){
		if (o.isOperationSuccessful()) {
			// Show, position and set the text
			if (BaseObject.is(this.tooltip, "BaseWindow")) {
				
			} else {
				// Successful but not a window is a big mess, let's just donothing, but complete the operation for the outside world
				op.CompleteOperation(false, IOperation.errorname("unspecified"));
			}
		} else {
			// Hide errors, but reset state anyway
			this.tooltip = null;
			this.expire();
			op.CompleteOperation(false, IOperation.errorname("unspecified"));
		}
	}));
	
	return op;
}

ToolTipWindow.prototype.openTipWindow = function() {
	this.tooltip = new SimpleViewWindow(
		this.configuration.template,
		WindowStyleFlags.visible | WindowStyleFlags.draggable | WindowStyleFlags.topmost | WindowStyleFlags.adjustclient,
		this.$calcTipPositionPosition(placement),
		this.parentwnd,
		{
			view: '<div data-class="TrivialView" data-bind-text="{read path=caption}" style="background-color: #FFFF40; color: #000000"></div>', // Inline template for the moment
			directData: { caption:"Tooltip", description: "And this is the description ..."},
			on_FirstShown: function(msg) {
				msg.target.activateWindow();
			},
			on_Destroy: this.thisCall(function(msg) {
				this.tooltip = null; // Clear the field where we keep the tooltip window.
			})
		});
}


ToolTipWindow.prototype.this.$calcTipPositionPosition = function() {
	return this.calcRect(this.element,new Size(200,50),this.placement);
}


PopDialog.prototype.calcRect = function(el,size) {
	var el_cont = this.parentwnd.get_clientcontainer();
	var el_rect = Rect.fromBoundingClientRectangle(el);
	el_rect.x = el_rect.y = 0;
	var anchorrect = el_rect.mapFromToElements(el, null);
	var cont_rect = Rect.fromBoundingClientRectangle(el_cont);
	var sz = new Rect(0, 0, 300, 350);
	if (size) sz.set_size(size);
	var r = cont_rect.adjustPopUp(anchorrect, sz, "aboveunder", 0, 0);
	return r.mapFromToElements(null, el_cont);
}