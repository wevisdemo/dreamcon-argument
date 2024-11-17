import { CommentView } from "./room";

export interface RoomDB {
  id?: string;
  title: string;
  comment_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface CommentDB {
  id?: string;
  comment_view: CommentView;
  reason: string;
  like_count: number;
  parent_room_id: string;
  parent_comment_ids: string[];
  comment_ids: string[];
  created_at: string;
  updated_at: string;
}
