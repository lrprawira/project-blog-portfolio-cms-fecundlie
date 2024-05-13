import { Component } from "solid-js"

const BlogEntry: Component<{ title: string, content: string, timestamp: number }> = (props) => {
	return (
		<div class="w-full text-sm">
			<h1 class="text-2xl text-slate font-bold uppercase">{props.title}</h1>
			<div class="text-base font-light" innerHTML={props.content}></div>
			<div class="mt-8 text-gray-400">
				{new Date(props.timestamp * 1000).toDateString()}
			</div>
		</div>
	);
}

export default BlogEntry;
