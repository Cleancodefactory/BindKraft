


/*CLASS*/
function TaskDispenser() {
    BaseObject.apply(this, arguments);
}
TaskDispenser.Inherit(BaseObject, "TaskDispenser");
TaskDispenser.prototype.tasks = new InitializeArray("Dispenser's tasks");
// task - task object, understood by the consummer only (can be anything)
// target - the consummer, can be A) reference to object, or B) string class name
// comparable - simple value that can be compared with == operator - serves as fast filter
// conditionCallback - if comparable is passed and assigned to the task and passes the comparison this is also called (if available) 
//  and the task is piscked if it returns true.
//  condition prototype: function({task:,target:,comparable:,condition:}, targetAsked, comparableAsked, param) return true if the condition is met.
TaskDispenser.prototype.post = function (task, target, comparable, conditionCallback) {
    this.tasks.push({ task: task, target: target, comparable: comparable, condition: conditionCallback });
};
// target - query tasks only forthat target
// comparable - a value to compare with the task's comparable value (assigned to the task when it was posted)
// param - passed to the conditionCallback if such is registered with a particular task
// If the task has no conditionCallback it is assumed that the condition is always true.
// If the comparable passed or the tasks comparable is null this is considered always match
// Tasks are not removed until the consumer calls done with the task passed as argument or alternatively calling remove.
TaskDispenser.prototype.query = function (target, comparable, param) {
    var arr = this.tasks.Select(function (idx, task) {
        if (task == null) return null;
        if (target == null || task.target == null || target == task.target || (BaseObject.is(target, "string") && BaseObject.is(task.target, target))) {
            if (comparable == null || task.comparable == null || (task.comparable == comparable)) {
                if (task.condition == null || BaseObject.callCallback(task.condition, task, target, comparable, param)) {
                    return task.task;
                }
            }
        }
        return null;
    });
    return arr;
};
TaskDispenser.prototype.done = function (task_in) {
    if (task_in == null) return;
    this.tasks.Delete(function(idx, task) {
        if (task.task == task_in) return true;
        return false;
    });
};
// Like query, but also allows for a condition callback that is "asked" for each task if it should be deleted. 
// The callback's prototype is function(task, target, comparable, param), returning true means "delete the item".
TaskDispenser.prototype.remove = function(target, comparable, condition, param) {
    this.tasks.Delete(function(idx, task) {
        if (target == null || target == task.target) {
            if (comparable != null && comparable == task.comparable) {
                if (condition == null || BaseObject.callCallback(condition, task, target, comparable, param)) {
                    return true;
                }
            }
        }
        return false;
    });
};