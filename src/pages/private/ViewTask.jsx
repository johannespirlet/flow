import { useParams } from "react-router-dom";

export default function ViewTask() {

	const { id } = useParams();

  return (
    <h1>ViewTask {id}</h1>
  )
}
