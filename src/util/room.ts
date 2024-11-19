import { ref, set, update } from "firebase/database";
import { Room } from "../types/room";
import { database } from "../lib/firebase";

export const HandleDeleteRoom = async (room: Room) => {
  if (!room) {
    return;
  }

  const updates = {} as any;
  for (const childId of room.child_node_ids || []) {
    updates["/comments/" + childId] = null;
  }
  await update(ref(database), updates);

  const roomRef = ref(database, "rooms/" + room?.id);
  set(roomRef, null);
};
