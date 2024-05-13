import {customElement} from 'solid-element';
import { CustomElement } from './types';

function Example() {
	return (<div style={{color: 'red'}}>Hello World</div>);
}

const componentTag = 'example-element';

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			[componentTag]: CustomElement<typeof Example>
		}
	}
}

customElement(componentTag, {}, Example);

export default Example;
