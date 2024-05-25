import { customElement, noShadowDOM } from "solid-element";
import { CustomElement } from "./types";
import { ParentComponent } from "solid-js";

const componentTag = "bpc-images";

const Images: ParentComponent<{ minSize?: number }> = (props) => {
  noShadowDOM();

  return (
    <div
      class={`${componentTag} grid gap-2`}
      style={{
        "grid-template-columns": `repeat(auto-fill, minmax(${props.minSize ?? 200}px, 1fr))`,
      }}
    >
      {props.children instanceof HTMLCollection
        ? Array.from(props.children).map((x) => {
            let img = x as HTMLElement;
            if (!(img instanceof HTMLImageElement)) {
              img = img.querySelector("img") ?? img;
            }
            img.setAttribute("loading", "lazy");
            img.style.width = "100%";
            if (!img.hasAttribute("alt")) {
              img.setAttribute("alt", "");
            }
            return x;
          })
        : null}
    </div>
  );
};

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      [componentTag]: CustomElement<typeof Images>;
    }
  }
}

customElement(componentTag, { children: <></>, minSize: undefined }, Images);

export default Images;
