import { useNavigate } from '@solidjs/router';
function Root() {
	const navigate = useNavigate();
	navigate('/welcome', { replace: true });
	return (<div>Redirecting...</div>);
}

export default Root;
