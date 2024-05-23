import { CgSpinner } from "solid-icons/cg";
import { Component } from "solid-js";

const Loading: Component<{ class?: string, size?: number }> = (props) => {
  return <CgSpinner size={props.size ?? 24} class={`animate-spin ${props.class ?? ""}`} />;
};

export default Loading;
