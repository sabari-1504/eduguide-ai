
import { College } from './types';
import { chennaiColleges } from './districts/chennai';
import { coimbatoreColleges } from './districts/coimbatore';
import { 
  tiruchirappaliColleges, 
  maduraiColleges, 
  salemColleges, 
  velloreColleges 
} from './districts/majorDistricts';
import { otherDistrictsColleges } from './districts/otherDistricts';
import { ariyalurColleges } from './districts/ariyalur';
import { chengalpattuColleges } from './districts/chengalpattu';
import { cuddoloreColleges } from './districts/cuddalore';
import { dharmpuriColleges } from './districts/dharmapuri';
import { dindigulColleges } from './districts/dindigul';
import { erodeColleges } from './districts/erode';
import { ramanathapuramColleges } from './districts/ramanathapuram';
import { ranipetColleges } from './districts/ranipet';
import { sivagangaiColleges } from './districts/sivagangai';
import { tenkasiColleges } from './districts/tenkasi';
import { thanjavurColleges } from './districts/thanjavur';
import { theniColleges } from './districts/theni';
import { thiruvannamalaiColleges } from './districts/thiruvannamalai';
import { thoothukudiColleges } from './districts/thoothukudi';
import { tiruchirappalliColleges } from './districts/tiruchirappalli';
import { mayiladuthuraiColleges } from './districts/mayiladuthurai';
import { tirunelveliColleges } from './districts/tirunelveli';
import { tirupathurColleges } from './districts/tirupathur';
import { tiruppurColleges } from './districts/tiruppur';
import { tiruvallurColleges } from './districts/tiruvallur';
import { tiruvannamalaiColleges as tiruvannamalaiUpdatedColleges } from './districts/tiruvannamalai';
import { tiruvarurColleges } from './districts/tiruvarur';
import { velloreColleges as velloreUpdatedColleges } from './districts/vellore';
import { villupuramColleges } from './districts/villupuram';
import { virudhunagarColleges } from './districts/virudhunagar';

// Combine all colleges
export const colleges: College[] = [
  ...chennaiColleges,
  ...coimbatoreColleges,
  ...tiruchirappaliColleges,
  ...tiruchirappalliColleges,
  ...maduraiColleges,
  ...salemColleges,
  ...velloreColleges,
  ...velloreUpdatedColleges,
  ...ariyalurColleges,
  ...chengalpattuColleges,
  ...cuddoloreColleges,
  ...dharmpuriColleges,
  ...dindigulColleges,
  ...erodeColleges,
  ...ramanathapuramColleges,
  ...ranipetColleges,
  ...sivagangaiColleges,
  ...tenkasiColleges,
  ...thanjavurColleges,
  ...theniColleges,
  ...thiruvannamalaiColleges,
  ...tiruvannamalaiUpdatedColleges,
  ...thoothukudiColleges,
  ...mayiladuthuraiColleges,
  ...tirunelveliColleges,
  ...tirupathurColleges,
  ...tiruppurColleges,
  ...tiruvallurColleges,
  ...tiruvarurColleges,
  ...villupuramColleges,
  ...virudhunagarColleges,
  ...otherDistrictsColleges
];

export const districts = [
  "Chennai",
  "Coimbatore", 
  "Tiruchirappalli",
  "Madurai",
  "Salem",
  "Vellore",
  "Ariyalur",
  "Chengalpattu",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Ramanathapuram",
  "Ranipet",
  "Sivagangai",
  "Thanjavur",
  "Tirunelveli",
  "Kanchipuram",
  "Namakkal",
  "Karur",
  "Krishnagiri",
  "Nagapattinam",
  "Pudukkottai",
  "Perambalur",
  "Theni",
  "Tenkasi",
  "Tirupathur",
  "Thoothukudi",
  "Kallakurichi",
  "Kanyakumari",
  "Nilgiris",
  "Mayiladuthurai",
  "Virudhunagar",
  "Villupuram",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur"
];

// Re-export the College type for convenience
export type { College };
