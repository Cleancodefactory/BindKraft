// DEPRECATED - not included in the source tree
/*CLASS*/
function MessageBox() {
	ViewBase.apply(this,arguments);
	this.commands = [];
}
MessageBox.$msgboxtemplate = '<div data-class="MessageBox"><h2 data-bind-text="{read path=message}"></h2></div>'
MessageBox.Inherit(ViewBase, "MessageBox")
	.Implement(ITemplateRoot)
	.DeclarationBlock({
		OnDataContextChanged: function() {
			if (BaseObject.getProperty(this,"data.buttonOk",false)) {
				this.commands.push(new Command);
			}
		},
		OnButton: function(e,dc, bind) {
			var type = bind.bindingParameter;
			var w = this.get_hostcontainer();
			if (BaseObject.isCallback(w.get_userdata())) {
				this.asyncCall(w.get_userdata(), type);
			}
			this.closeWindow();
		},
		get_caption: function() {
			return BaseObject.getProperty(this,"data.caption","Message");			
		}
	});