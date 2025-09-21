export interface College {
  id: number;
  name: string;
  district: string;
  type: string;
  lat: number;
  lng: number;
  established: number;
  courses: number;
  website?: string;
  /**
   * Pincode of the college (optional, string)
   */
  pincode?: string;
  /**
   * Review/rating of the college (optional, string)
   */
  review?: string;
}
