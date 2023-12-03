export interface EventUserDto {
  id: number;
  creatorId: number;
  creatorFirstName: string;
  creatorLastName: string;
  title: string;
  description: string;
  dateTime: Date;
  city: string;
  address: string;
  country: string;
  color: string;
  playlistTitle: string;
  shoppingListTitle: string;
  receiptTitle: string;
}
