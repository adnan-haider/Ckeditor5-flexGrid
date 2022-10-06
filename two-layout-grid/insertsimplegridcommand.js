import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertSimpleGridCommand extends Command {
    execute({ value }) {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        editor.model.change( writer => {
            // Insert <simpleGrid>*</simpleGrid> at the current selection position
            // in a way that will result in creating a valid model structure.
            editor.model.insertContent( createSimpleBox( editor, writer, selection, value ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'simpleGrid' );

        this.isEnabled = allowedIn !== null;
    }
}

function createSimpleBox( ed, writer, selection, val ) {
	const simpleGrid = writer.createElement( 'simpleGrid', {"attr": val} );
    const simpleGridLayout1 = writer.createElement( 'simpleGridLayout' );
    const simpleGridLayout2 = writer.createElement( 'simpleGridLayout' );

    writer.append( simpleGridLayout1, simpleGrid );
    writer.appendElement( 'paragraph', simpleGridLayout1 );

    writer.append( simpleGridLayout2, simpleGrid );
    writer.appendElement( 'paragraph', simpleGridLayout2 );

    return simpleGrid;
}