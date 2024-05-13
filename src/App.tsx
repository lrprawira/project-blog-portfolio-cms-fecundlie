import { Link } from '@solidjs/meta';
import { Router, Route, useLocation } from '@solidjs/router'
import SideNavigation from "./components/SideNavigation";
import Welcome from "./pages/Welcome";
import { ParentProps } from 'solid-js';
import Root from './pages/Root';
import NotFound from './pages/NotFound';
import AboutMe from './pages/AboutMe';
import PersonalBlog from './pages/PersonalBlog';
import { MetaProvider, Title } from '@solidjs/meta';
import constants from './lib/constants';
import SiteWideLinks from './components/SiteWideLinks';
import NotFoundRedirector from './pages/NotFoundRedirector';

function RouterWrapper(props: ParentProps) {
	const location = useLocation();
	return (<div class={'flex h-full w-full bg-gradient-to-tr to-[#393745] from-[#24222F]'}>
		{
			new Set(['/', '/welcome', '/404']).has(location.pathname) ?
				null : <SideNavigation />
		}
		{props.children}
		<SiteWideLinks />
	</div>)
}

function App() {
	return (
		<MetaProvider>
			<div id="app" class='w-full h-full font-inter'>
				<Title>{constants.title}</Title>
				<Link rel='icon' href={constants.favicon} type='image/x-icon'></Link>
				<Router root={RouterWrapper}>
					<Route path={"/"} component={Root} />
					<Route path={"/welcome"} component={Welcome} />
					<Route path={"/about-me"} component={AboutMe} />
					<Route path={"/personal-blog"} component={PersonalBlog} />
					<Route path={'/404'} component={NotFound} />
					<Route path={'*404'} component={NotFoundRedirector} />
				</Router>
			</div>
		</MetaProvider>
	);
}


export default App;
