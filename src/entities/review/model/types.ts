export type ReviewResponse = {
  id: number;
  orderId: number;
  nickname: string;
  content: string;
  rating: number;
  createdAt: string;
};

export type ReviewCreateRequest = {
  rating: number;
  content: string;
};
