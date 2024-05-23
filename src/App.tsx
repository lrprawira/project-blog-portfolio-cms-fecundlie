import { Link } from "@solidjs/meta";
import { Router, Route, useLocation } from "@solidjs/router";
import SideNavigation from "./components/SideNavigation";
import { ParentProps, createEffect, lazy } from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import constants from "./lib/constants";
import SiteWideLinks from "./components/SiteWideLinks";

function RouterWrapper(props: ParentProps) {
  const location = useLocation();
  return (
    <div
      class={"flex h-full w-full bg-gradient-to-tr to-[#393745] from-[#24222F]"}
    >
      {new Set(["/", "/welcome", "/404"]).has(location.pathname) ? null : (
        <SideNavigation />
      )}
      {props.children}
      <SiteWideLinks />
    </div>
  );
}

function App() {
  createEffect(async () => {

  });

  const LazyRoot = lazy(() => import("./pages/Root"));
  const LazyWelcome = lazy(() => import("./pages/Welcome"));
  const LazyAboutMe = lazy(() => import("./pages/AboutMe"));
  const LazyPersonalBlog = lazy(() => import("./pages/PersonalBlog"));
  const LazyNotFound = lazy(() => import("./pages/NotFound"));
  const LazyNotFoundRedirector = lazy(
    () => import("./pages/NotFoundRedirector"),
  );

  return (
    <MetaProvider>
      <div id="app" class="w-full h-full font-inter">
        <Title>{constants.title}</Title>
        {/* <Link rel="icon" href={constants.favicon} type="image/x-icon"></Link> */}
        <Router root={RouterWrapper}>
          <Route path={"/"} component={LazyRoot} />
          <Route path={"/welcome"} component={LazyWelcome} />
          <Route path={"/about-me"} component={LazyAboutMe} />
          <Route path={"/personal-blog"} component={LazyPersonalBlog} />
          <Route path={"/404"} component={LazyNotFound} />
          <Route path={"*404"} component={LazyNotFoundRedirector} />
        </Router>
      </div>
    </MetaProvider>
  );
}

export default App;
