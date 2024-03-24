import { useOutletContext } from 'react-router-dom';

export default function Summary() {
	const userData = useOutletContext();

	return (
		<>
			<title>Let`s Sum Up - Flow</title>
			<h1>
				Welcome {userData.fname} {userData.lname}
			</h1>
		</>
	);
}
