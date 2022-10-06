import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertSimpleGridCommand from './insertsimplegridcommand';
import './theme/style.css';

export default class SimpleGridEditing extends Plugin {
    init() {
        //console.log( 'SimpleGridEditing#init() got called' );

		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertSimpleBox', new InsertSimpleGridCommand( this.editor ) ); //registering command

        this.editor.config.define( 'simpleGridConfig', {
            types: [ {'key': '1/2 + 1/2 Columns Layout', 'text': 'default'}, {'key': '1/3 + 2/3 Columns Layout', 'text': 'layout2'}, {'key': '2/3 + 1/3 Columns Layout', 'text': 'layout3'} ]
        } );
    }

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'simpleGrid', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block',

			allowAttributes: [ 'attr', 'data-type' ]
        } );

		schema.register( 'simpleGridLayout', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'simpleGrid',

			// Allow content which is allowed in the root (e.g. paragraphs).
			allowContentOf: '$root'
		} );

		/*schema.addChildCheck( ( context, childDefinition ) => {
            if ( context.endsWith( 'simpleGridLayout' ) && childDefinition.name == 'simpleGrid' ) {
                return false;
            }
        } );*/
	}

	_defineConverters() {
        const conversion = this.editor.conversion;

        // <simpleGrid> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleGrid',
            view: {
                name: 'div',
                classes: 'simple-grid',
                'data-type': true
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleGrid',
            /*view: {
                name: 'div',
                classes: 'simple-grid',
                'data-type': true
            }*/
            view: ( modelElement, { writer: viewWriter } ) => {
                const div = setAttrsData( modelElement, viewWriter );

                // Enable widget handling on a placeholder element inside the editing view.
                return toWidget( div, viewWriter);
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleGrid',
            view: ( modelElement, { writer: viewWriter } ) => {
				const div = setAttrsData( modelElement, viewWriter );

                // Enable widget handling on a placeholder element inside the editing view.
                return toWidget( div, viewWriter, { label: 'Grid Row' } );
            }
        } );

        // <simpleGridLayout> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'simpleGridLayout',
            view: {
                name: 'div',
                classes: 'simple-grid-layout'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'simpleGridLayout',
            view: {
                name: 'div',
                classes: 'simple-grid-layout'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'simpleGridLayout',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div', { class: 'simple-grid-layout', 'data-label': 'Column' } );

                return toWidgetEditable( div, viewWriter, { label: 'Grid Column' } );
            }
        } );

		// Helper method for both downcast converters.
        function setAttrsData( modelItem, viewWriter ) {
            //console.log( modelItem, viewWriter );
            let opt = { 'class': 'simple-grid', 'data-label': 'Grid' },
                preAttrs = null;
            const attr = modelItem.getAttribute( 'attr' );
            if (attr && (typeof attr !== 'undefined')) {
                opt["class"] = opt["class"] + " type--" + attr;
                opt["data-type"] = attr;
            } else {
                const jsonModelObj = modelItem.toJSON();

                if (jsonModelObj) {
                    if (jsonModelObj.attributes) {
                        let attrObj = jsonModelObj.attributes.htmlAttributes;

                        if (attrObj && (attrObj.classes)) {
                            preAttrs = {classes: ['simple-grid'], 'data_type': ''};

                            Object.values(attrObj.classes).forEach(function (classname, ind) {
                                if (classname.indexOf('type--') >= 0) {
                                    const splitVal = classname.replace('type--', '');
                                    preAttrs['classes'].push('type--' + splitVal);
                                    preAttrs['data_type'] = splitVal;
                                } else if (classname.indexOf('ck-widget') < 0) {
                                    preAttrs['classes'].push(classname);
                                }
                            });
                        }
                    }
                }

                if (preAttrs) {
                    opt['class'] = preAttrs['classes'].join(' ');
                    opt['data-type'] = preAttrs['data_type'];
                }
                //console.log( 'Attributes:', jsonModelObj, jsonModelObj.attributes.htmlAttributes );
            }

            return viewWriter.createContainerElement( 'div', opt );
        }
    }
}
