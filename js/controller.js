'use strict';
export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.handleModelChangeHandler = this.handleModelChange.bind(this);
        // контроллер при снятии флажка в представлении
        // перестает слушать изменения модели,
        // а при установке - продолжает
        this.view.setChangeHandler(
            started => {
                if (started) {
                    this.registerModelHandler();
                } else {
                    this.model.changes.remove('change', this.handleModelChangeHandler);
                }
            }
        );
        this.registerModelHandler();
    }

    registerModelHandler() {
        this.model.changes.sub('change', this.handleModelChangeHandler);
        this.handleModelChange();
    }

    handleModelChange() {
        // при вызове функции обратного вызова
        // контроллер перерисовывает представление
        this.view.render(this.model);
    }

}