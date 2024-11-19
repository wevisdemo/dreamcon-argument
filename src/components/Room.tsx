import { useParams } from "react-router-dom";

export default function Room() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>Room: {id}</h2>
    </div>
  );
}
