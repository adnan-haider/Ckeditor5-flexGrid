import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

export default class SimpleGridUI extends Plugin {
    init() {
        //console.log( 'SimpleGridUI#init() got called' );

        const editor = this.editor,
			gridTypes = editor.config.get( 'simpleGridConfig.types' ),
			t = editor.t;

        // The "simpleGrid" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'simpleGrid', locale => {
            // The state of the button will be bound to the widget command.

			const dropdownView = createDropdown( locale ),
				command = editor.commands.get( 'insertSimpleBox' );

			// Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( gridTypes, t ) );

            //buttonView.set( {
            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Flex Grid' ),
                withText: false,
                tooltip: true,
				icon: '<svg class="feather feather-columns" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/></svg>'
            } );

            dropdownView.bind( 'isEnabled' ).to( command ); // Bind the state of the button to the command.

			// Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( 'insertSimpleBox', { value: evt.source.commandParam } );
                editor.editing.view.focus();
			} );

            //return buttonView;
            return dropdownView;
        } );
    }
}

function getDropdownItemsDefinitions( typeNames, trans ) {
    const itemDefinitions = new Collection();

    for ( const obj of typeNames ) {
        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: obj.text,
                label: trans( obj.key ),
                withText: true,
				tooltip: true
            })
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    return itemDefinitions;
}