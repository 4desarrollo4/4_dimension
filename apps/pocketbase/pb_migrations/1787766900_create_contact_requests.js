migrate((app) => {
    const collection = new Collection({
        name: 'contact_requests',
        type: 'base',
        fields: [
            { name: 'name', type: 'text', required: true, min: 2, max: 120 },
            { name: 'company', type: 'text', required: false, max: 160 },
            { name: 'email', type: 'email', required: true },
            { name: 'line', type: 'select', values: ['calzado', 'ropa', 'dotaciones', 'otro'], maxSelect: 1 },
            { name: 'message', type: 'text', required: true, min: 10, max: 4000 },
            { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        listRule: null,
        viewRule: null,
        createRule: '',
        updateRule: null,
        deleteRule: null,
    });
    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId('contact_requests');
    app.delete(collection);
});
