import SimpleGridEditing from './simplegridediting';
import SimpleGridUI from './simplegridui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class SimpleGrid extends Plugin {
    static get requires() {
        return [ SimpleGridEditing, SimpleGridUI ];
    }
    
	static get pluginName() {
		return 'SimpleGrid';
	}
}
