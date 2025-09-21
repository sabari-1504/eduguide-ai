import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

interface ProfileDetailsFormData {
  name: string;
  age: string;
  gender: string;
  city: string;
  district: string;
  pincode: string;
  schoolName: string;
  schoolDistrict: string;
  schoolPincode: string;
  yearOf10th: string;
  phone: string;
  group12th: string;
  preferredCourse: string;
  affordability: string;
}

interface AcademicAssessmentProps {
  setActiveSection?: (section: string) => void;
}

const AcademicAssessment: React.FC<AcademicAssessmentProps> = ({ setActiveSection }) => {
  const [user] = useAuthState(auth);
  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState<ProfileDetailsFormData>({
    name: '',
    age: '17',
    gender: '',
    city: '',
    district: '',
    pincode: '',
    schoolName: '',
    schoolDistrict: '',
    schoolPincode: '',
    yearOf10th: String(currentYear - 2),
    phone: '',
    group12th: '',
    preferredCourse: '',
    affordability: '',
  });
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [educationLevel, setEducationLevel] = useState<'12th' | 'Diploma'>('12th');
  const [diplomaDept, setDiplomaDept] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Basic validation
    if (!form.name || !form.age || !form.gender || !form.city || !form.district || !form.pincode || !form.schoolName || !form.schoolDistrict || !form.schoolPincode || !form.yearOf10th || !form.preferredCourse || !form.affordability) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }
    if (educationLevel === '12th' && !form.group12th) {
      setError('Please select your 12th group.');
      setLoading(false);
      return;
    }
    if (educationLevel === 'Diploma' && !diplomaDept) {
      setError('Please enter your diploma department.');
      setLoading(false);
      return;
    }
    try {
      if (!user) throw new Error('User not logged in');
      // Save educationLevel and diplomaDept if needed
      const dataToSave: any = {
        ...form,
        educationLevel,
      };
      if (educationLevel === 'Diploma') {
        dataToSave.diplomaDept = diplomaDept;
      }
      if (educationLevel === '12th') {
        dataToSave.group12th = form.group12th;
      }
      // Remove undefined fields
      Object.keys(dataToSave).forEach(key => dataToSave[key] === undefined && delete dataToSave[key]);
      await setDoc(doc(db, 'users', user.uid, 'profileDetails', 'main'), dataToSave);
      setSuccess(true);
      if (setActiveSection) {
        setTimeout(() => setActiveSection('home'), 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save.');
    }
    setLoading(false);
  };

  // Prefill from Firestore when editing
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user) { setPrefilling(false); return; }
        const ref = doc(db, 'users', user.uid, 'profileDetails', 'main');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          // Set education controls first
          if (data.educationLevel === 'Diploma') {
            setEducationLevel('Diploma');
            setDiplomaDept(data.diplomaDept || '');
          } else {
            setEducationLevel('12th');
          }
          // Build form values with safe fallbacks
          setForm(prev => ({
            name: data.name ?? prev.name,
            age: data.age ?? prev.age,
            gender: data.gender ?? prev.gender,
            city: data.city ?? prev.city,
            district: data.district ?? prev.district,
            pincode: data.pincode ?? prev.pincode,
            schoolName: data.schoolName ?? prev.schoolName,
            schoolDistrict: data.schoolDistrict ?? prev.schoolDistrict,
            schoolPincode: data.schoolPincode ?? prev.schoolPincode,
            yearOf10th: data.yearOf10th ?? prev.yearOf10th,
            phone: data.phone ?? prev.phone,
            group12th: data.group12th ?? prev.group12th,
            preferredCourse: data.preferredCourse ?? prev.preferredCourse,
            affordability: data.affordability ?? prev.affordability,
          }));
        }
      } catch (e) {
        // Non-blocking: keep empty form if fetch fails
        console.error('Failed to prefill profile:', e);
      } finally {
        setPrefilling(false);
      }
    };
    loadProfile();
  }, [user]);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Profile Details</h2>
      {prefilling ? (
        <div className="text-center text-gray-500 py-8">Loading profile...</div>
      ) : success ? (
        <div className="text-center text-green-600 text-lg font-semibold py-8">
          Profile details saved successfully!<br />
          Redirecting to Home...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <div className="flex items-center gap-2">
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setForm(prev => ({ ...prev, age: String(Math.max(10, Number(prev.age) - 1)) }))}>-</button>
              <input type="number" name="age" value={form.age} onChange={handleChange} className="border p-2 rounded w-20 text-center" required min={10} />
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setForm(prev => ({ ...prev, age: String(Number(prev.age) + 1) }))}>+</button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <div className="flex gap-4">
              <label><input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange} required /> Male</label>
              <label><input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange} required /> Female</label>
              <label><input type="radio" name="gender" value="Other" checked={form.gender === 'Other'} onChange={handleChange} required /> Other</label>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">District</label>
            <select name="district" value={form.district} onChange={handleChange} className="border p-2 rounded w-full" required>
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Location Pincode</label>
            <input type="text" name="pincode" value={form.pincode} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>
          <div className="border-t pt-4 mt-4">
            <label className="block mb-1 font-medium">Name of School</label>
            <input type="text" name="schoolName" value={form.schoolName} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">School District</label>
            <select name="schoolDistrict" value={form.schoolDistrict} onChange={handleChange} className="border p-2 rounded w-full" required>
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">School Pincode</label>
            <input type="text" name="schoolPincode" value={form.schoolPincode} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Year of First 10th Std Appearance</label>
            <div className="flex items-center gap-2">
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setForm(prev => ({ ...prev, yearOf10th: String(Math.max(1900, Number(prev.yearOf10th) - 1)) }))}>-</button>
              <input type="number" name="yearOf10th" value={form.yearOf10th} onChange={handleChange} className="border p-2 rounded w-28 text-center" required min={1900} max={2100} />
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setForm(prev => ({ ...prev, yearOf10th: String(Number(prev.yearOf10th) + 1) }))}>+</button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number <span className="text-gray-400 text-xs">(optional)</span></label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Current Level of Education</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="educationLevel"
                  value="12th"
                  checked={educationLevel === '12th'}
                  onChange={() => setEducationLevel('12th')}
                />{' '}
                12th
              </label>
              <label>
                <input
                  type="radio"
                  name="educationLevel"
                  value="Diploma"
                  checked={educationLevel === 'Diploma'}
                  onChange={() => setEducationLevel('Diploma')}
                />{' '}
                Diploma
              </label>
            </div>
          </div>
          {educationLevel === '12th' && (
            <div>
              <label className="block mb-1 font-medium">12th Group</label>
              <div className="flex gap-4 flex-wrap">
                <label>
                  <input
                    type="radio"
                    name="group12th"
                    value="PCMB"
                    checked={form.group12th === 'PCMB'}
                    onChange={handleChange}
                    required={educationLevel === '12th'}
                  />{' '}
                  Physics, Chemistry, Maths, Biology
                </label>
                <label>
                  <input
                    type="radio"
                    name="group12th"
                    value="PCMC"
                    checked={form.group12th === 'PCMC'}
                    onChange={handleChange}
                    required={educationLevel === '12th'}
                  />{' '}
                  Physics, Chemistry, Maths, Computer Science
                </label>
              </div>
            </div>
          )}
          {educationLevel === 'Diploma' && (
            <div>
              <label className="block mb-1 font-medium">Diploma Department</label>
              <input
                type="text"
                name="diplomaDept"
                value={diplomaDept}
                onChange={e => setDiplomaDept(e.target.value)}
                className="border p-2 rounded w-full"
                required={educationLevel === 'Diploma'}
                placeholder="Enter your department"
              />
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">Preferred Course or Degree</label>
            <select name="preferredCourse" value={form.preferredCourse} onChange={handleChange} className="border p-2 rounded w-full" required>
              <option value="">Select</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech Integrated">M.Tech Integrated</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Annual Affordability (₹)</label>
            <input type="number" name="affordability" value={form.affordability} onChange={handleChange} className="border p-2 rounded w-full" required min={0} />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AcademicAssessment; 