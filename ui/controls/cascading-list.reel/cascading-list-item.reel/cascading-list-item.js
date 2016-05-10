var Component = require("montage/ui/component").Component;

/**
 * @class CascadingListItem
 * @extends Component
 */
exports.CascadingListItem = Component.specialize({


    _data: {
        value: null
    },


    data: {
        get: function () {
            return this._data;
        },
        set: function (data) {
            if (this._data !== data) {
                var inspectorComponentModuleId = null;

                if (data) {
                    var defaultInspectorId = this.constructor.DEFAULT_INSPECTOR_ID,
                        userInterfaceDescriptor = data.userInterfaceDescriptor,
                        object = this.object = data.object;

                    this.isCollection = Array.isArray(object);
                    this.userInterfaceDescriptor = userInterfaceDescriptor;

                    if (userInterfaceDescriptor) {
                        //todo: need to be smarter here
                        if (this.isCollection) {
                            var collectionInspectorComponentModule = userInterfaceDescriptor.collectionInspectorComponentModule;

                            inspectorComponentModuleId = collectionInspectorComponentModule ?
                                collectionInspectorComponentModule.id : defaultInspectorId;

                        } else if (object && typeof object === "object") {
                            var inspectorComponentModule  = userInterfaceDescriptor.inspectorComponentModule,
                                objectPrototype = Object.getPrototypeOf(Object.getPrototypeOf(object)),
                                id = object.id;

                            if ((id !== void 0 && id !== null) || !objectPrototype.hasOwnProperty("id") || object._isNewObject) {
                                inspectorComponentModuleId = inspectorComponentModule ?
                                    inspectorComponentModule.id : defaultInspectorId;
                            } else {
                                var creatorComponentModule = userInterfaceDescriptor.creatorComponentModule;

                                inspectorComponentModuleId = creatorComponentModule ? creatorComponentModule.id :
                                    inspectorComponentModule ? inspectorComponentModule.id : defaultInspectorId;
                            }
                        }
                    }
                } else {
                    this.object = null;
                }

                this._data = data;
                this.inspectorComponentModuleId = inspectorComponentModuleId;
            }
        }
    },


    isCollection: {
        value: false
    },


    inspectorComponentModuleId: {
        value: null
    },


    _selectedObject: {
        value: void 0
    },


    selectedObject: {
        get: function () {
            return this._selectedObject;
        },
        set: function (selectedObject) {
            if (this._selectedObject !== selectedObject) {
                this._selectedObject = selectedObject;

                if (selectedObject !== void 0 && selectedObject !== null) {
                    this.cascadingList.expand(selectedObject, this.data.columnIndex + 1);

                } else if (this.data.columnIndex < this.cascadingList._currentIndex) {
                    this.cascadingList.popAtIndex(this.data.columnIndex + 1);
                }
            }
        }
    },

    needToScrollIntoView: {
        value: false
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addEventListener("placeholderContentLoaded", this);
            }
        }
    },

    handlePlaceholderContentLoaded: {
        value: function (event) {
            if (event.detail === this.content) {
                this.needToScrollIntoView = true;
                this.needsDraw = true;
            }
        }
    },

    resetSelection: {
        value: function () {
            this.selectedObject = null;

            if (this.content && this.content.component && this.content.component.selectedObject) {
                this.content.component.selectedObject = null;
            }
        }
    },


    dismiss: {
        value: function () {
            if (this._inDocument) {
                this.cascadingList.popAtIndex(this.data.columnIndex);
            }
        }
    },


    draw: {
        value: function () {
            if (this.needToScrollIntoView) {
                if (!this.content._element.clientWidth) {
                    this.needsDraw = true;
                } else {
                    this.cascadingList.scrollView.scrollIntoView(false);
                    this.needToScrollIntoView = false;
                }
            }
        }
    }

}, {

    DEFAULT_INSPECTOR_ID: {
        value: 'ui/controls/viewer.reel'
    }

});
