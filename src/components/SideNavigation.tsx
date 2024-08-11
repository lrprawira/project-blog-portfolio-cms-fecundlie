import { A, useLocation } from "@solidjs/router";
import styles from "./SideNavigation.module.css";
import constants from "../lib/constants";
import { Component, Index, Match, Show, Switch } from "solid-js";

import { useAdminStore } from '../lib/states';

const activeTextColor = "text-color-lime-400";
const inactiveTextColor = "text-color-stone";
const hoverTextColor = "hover:text-green-400";

const SideNavLink: Component<{
  name: string;
  pathname: string;
  indented: boolean;
}> = (props) => {
  const location = useLocation();
  return (
    <A
      href={props.pathname}
      class={`${location.pathname === props.pathname ? activeTextColor : inactiveTextColor} ${hoverTextColor} px-6 ${props.indented ? "pl-12" : ""} text-md font-bold`}
    >
      {props.name}
    </A>
  );
};

const SideNavText: Component<{ name: string; indented: boolean }> = (props) => {
  return (
    <div
      class={`${inactiveTextColor} ${hoverTextColor} cursor-default px-6 ${props.indented ? "pl-12" : ""} text-md font-bold`}
    >
      {props.name}
    </div>
  );
};

const SideNavSeparator: Component = () => {
  return <div class={`${inactiveTextColor} border-b-dotted mx-6`}></div>;
};

function SideNavigation() {
	const asAdmin = useAdminStore((state) => state.asAdmin);
  return (
    <>
      <div class={"w-16em"}> </div>
      <div class={styles.wrapper}>
        <nav class={styles.nav}>
          <A href="/" class="w-inherit pb-4 mt-8">
            <picture>
              <source srcset={"/logo.avif"} type="image/avif" />
              <source srcset={"/logo.webp"} type="image/webp" />
              <img
                class={"w-inherit px-6 box-border"}
                src={"/logo.png"}
                alt="Site Logo"
								loading="lazy"
								decoding="async"
              />
            </picture>
          </A>
					<div class="px-6 text-sm text-center mb-6 text-green">
						<Show when={asAdmin()}>
							Administrator View
							<br/>
							Setup the tokens beforehand!
						</Show>
					</div>
          <div
            class={"flex flex-col gap-3 flex-grow-1 flex-basis-0 overflow-auto"}
          >
            <Index each={constants.sidebarList}>
              {(sidebarEntryData) => (
                <Switch fallback={<SideNavSeparator />}>
                  <Match when={sidebarEntryData().type === "link"}>
                    <SideNavLink
                      name={sidebarEntryData().name ?? ""}
                      pathname={sidebarEntryData().target}
                      indented={sidebarEntryData().indented}
                    />
                  </Match>
                  <Match when={sidebarEntryData().type === "text"}>
                    <SideNavText
                      name={sidebarEntryData().name ?? ""}
                      indented={sidebarEntryData().indented}
                    />
                  </Match>
                </Switch>
              )}
            </Index>
          </div>
        </nav>
      </div>
    </>
  );
}

export default SideNavigation;
