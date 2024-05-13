import { useNavigate } from '@solidjs/router';
function NotFoundRedirector() {
	const navigate = useNavigate();
	navigate('/404', { replace: true });
	return (<div>Redirecting...</div>);
}

export default NotFoundRedirector;

