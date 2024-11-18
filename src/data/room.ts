import { Room, Comment, CommentView } from "@/types/room";

export const mockComments: Comment[] = [
  {
    id: "1",
    comment_view: CommentView.AGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความ สัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหนเป็นกติกาที่กำหนดโครงสร้างความสัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหน",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "2",
    comment_view: CommentView.AGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความ สัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหน",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "3",
    comment_view: CommentView.PARTIAL_AGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความ สัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหน",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "4",
    comment_view: CommentView.PARTIAL_AGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความ สัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหนเป็นกติกาที่กำหนดโครงสร้างความสัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหน",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "5",
    comment_view: CommentView.DISAGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความ สัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหน",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "6",
    comment_view: CommentView.DISAGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความ สัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ กำหนดว่าระบอบการปกครองเป็นอย่างไร สิทธิและเสรีภาพได้รับการคุ้มครองมากน้อยแค่ไหน",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "7",
    comment_view: CommentView.DISAGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความสัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ",
    parent_room_id: "1",
    parent_comment_ids: [],
    like_count: 4,
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
];

export const mockRooms: Room[] = [
  {
    id: "1",
    title:
      "ไม่มีรัฐประหาร มีรัฐธรรมนูญที่เป็นกติกาเดียวที่เป็นที่ยอมรับของทุกคน",
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "2",
    title: "รัฐมีหน้าที่จัดการเรื่องการศึกษา",
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "3",
    title: "การศึกษาเป็นสิทธิเสรีของทุกคน",
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "4",
    title: "การเลือกตั้งเป็นสิทธิเสรีของทุกคน",
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "5",
    title: "การเลือกตั้งเป็นสิทธิเสรีของทุกคน",
    comments: [],
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
];

export const mockRoom: Room = {
  id: "1",
  title: "ไม่มีรัฐประหาร มีรัฐธรรมนูญที่เป็นกติกาเดียวที่เป็นที่ยอมรับของทุกคน",
  comments: mockComments,
  created_at: "2021-09-01",
  updated_at: "2021-09-01",
};

export const mockComment: Comment = {
  id: "01",
  comment_view: CommentView.DISAGREE,
  reason:
    "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความสัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ",
  like_count: 4,
  parent_comment_ids: [],
  parent_room_id: "1",
  comments: mockComments,
  created_at: "2021-09-01",
  updated_at: "2021-09-01",
};

export const mockPreviousComments: Comment[] = [
  {
    id: "01",
    comment_view: CommentView.DISAGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความสัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ",
    like_count: 4,
    comments: mockComments,
    parent_comment_ids: [],
    parent_room_id: "1",
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
  {
    id: "02",
    comment_view: CommentView.AGREE,
    reason:
      "รัฐธรรมนูญเป็นกติกาพื้นฐานไม่ว่ารัฐใดก็ตาม เป็นกติกาที่กำหนดโครงสร้างความสัมพันธ์ระหว่าง สถาบันการเมืองต่างๆ",
    like_count: 4,
    comments: mockComments,
    parent_comment_ids: ["01"],
    parent_room_id: "1",
    created_at: "2021-09-01",
    updated_at: "2021-09-01",
  },
];
