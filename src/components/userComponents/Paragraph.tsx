import { customElement, noShadowDOM } from 'solid-element';
import { CustomElement } from './types';
import { Component } from 'solid-js';

const componentTag = 'bpc-paragraph';

const Paragraph: Component<{text: string}> = (props) => {
	noShadowDOM();
	return (
		<p class={`${componentTag}`}>
			{props.text}
		</p>
	);
}


declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			[componentTag]: CustomElement<typeof Paragraph>
		}
	}
}

customElement(componentTag, {text: ''}, Paragraph);

export default Paragraph;


