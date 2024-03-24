import { useParams } from 'react-router-dom';

export default function ViewTask() {
	const { id } = useParams();

	return (
		<>
			<title>Task {id} - Flow</title>
			<h1>ViewTask {id}</h1>
		</>
	);
}
