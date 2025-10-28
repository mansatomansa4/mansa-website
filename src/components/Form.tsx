'use client';


import { useState } from 'react';

export default function BecomeMemberForm() {
  type MemberFormData = {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    linkedin?: string;
    experience?: string;
    areaOfExpertise?: string;
    school?: string;
    level?: string;
    occupation?: string;
    jobtitle?: string;
    industry?: string;
    major?: string;
  };

  const initialFormState: MemberFormData = {
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    linkedin: '',
    experience: '',
    areaOfExpertise: '',
    school: '',
    level: '',
    occupation: '',
    jobtitle: '',
    industry: '',
    major: '',
  };

  const [formData, setFormData] = useState<MemberFormData>(initialFormState);
  const [membershipType, setMembershipType] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !membershipType || !gender) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([ v]) => v !== '' && v !== undefined)
    );

    const submissionData = {
      ...cleanedFormData,
      membershiptype: membershipType,
      gender,
    };

    // Use API client to submit member application
    const { api } = await import('@/lib/api');
    const { error: apiError } = await api.submitMemberApplication(submissionData);

    if (apiError) {
      console.error('API error:', apiError);
      setError(apiError || 'Something went wrong. Please try again.');
    } else {
      setFormData(initialFormState);
      setMembershipType('');
      setGender('');
      setShowModal(true);
    }

    setLoading(false);
  };

  const inputStyle =
    'w-full px-4 py-3 text-base rounded-lg dark:bg-gray-800 bg-white dark:text-white text-black border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors';

  return (
    <>
      <style>{`
        .text-orientation-fix * {
          writing-mode: horizontal-tb !important;
          text-orientation: mixed !important;
          direction: ltr !important;
          unicode-bidi: normal !important;
          -webkit-writing-mode: horizontal-tb !important;
          -webkit-text-orientation: mixed !important;
          -moz-writing-mode: horizontal-tb !important;
          -ms-writing-mode: horizontal-tb !important;
        }
      `}</style>
      <main className="flex justify-center items-center py-10 px-4">
        <div className="text-orientation-fix dark:bg-[#111827] bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="dark:text-white text-black text-center text-3xl font-bold mb-8">
          Become a <span className="text-[#7C72FF]">member</span>
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Fields */}
          {[
            { name: 'name', placeholder: 'Enter fullname' },
            { name: 'email', placeholder: 'Enter email', type: 'email' },
            { name: 'phone', placeholder: 'Enter number' },
            { name: 'country', placeholder: 'Enter country' },
            { name: 'city', placeholder: 'Enter city' },
            { name: 'linkedin', placeholder: 'LinkedIn profile link (optional)' }
          ].map((input) => (
            <input
              key={input.name}
              type={input.type || 'text'}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name as keyof MemberFormData] as string}
              onChange={handleChange}
              className={inputStyle}
            />
          ))}

          <div className="flex flex-col sm:flex-row gap-6">
            <select
              aria-label="Membership type"
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className={inputStyle}
            >
              <option value="">Membership type</option>
              <option value="mentor">Mentor</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
            <select
              aria-label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputStyle}
            >
              <option value="">Choose gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              {/* <option value="other">Other</option> */}
            </select>
          </div>

          {/* Dynamic Fields */}
          {membershipType === 'mentor' && (
            <>
              <input type="text" name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} className={inputStyle} />
              <input type="text" name="jobtitle" placeholder="Job Title" value={formData.jobtitle} onChange={handleChange} className={inputStyle} />
              <input type="text" name="experience" placeholder="No. of years in role" value={formData.experience} onChange={handleChange} className={inputStyle} />
            </>
          )}

          {membershipType === 'student' && (
            <>
              <input type="text" name="school" placeholder="School name" value={formData.school} onChange={handleChange} className={inputStyle} />
              <input type="text" name="level" placeholder="Level (e.g. University)" value={formData.level} onChange={handleChange} className={inputStyle} />
              <input type="text" name="major" placeholder="Major (e.g. CS)" value={formData.major} onChange={handleChange} className={inputStyle} />
            </>
          )}

          {membershipType === 'other' && (
            <input type="text" name="occupation" placeholder="Your occupation" value={formData.occupation} onChange={handleChange} className={inputStyle} />
          )}

          <button
            type="submit"
            className="w-full bg-[#7C72FF] hover:bg-[#6B61E6] text-white py-4 px-6 text-lg rounded-lg transition font-medium mt-8"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* ✅ WhatsApp Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50 max-w-sm w-full relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4 text-[#7C72FF]">🎉 You are In!</h2>
            <p className="text-center text-gray-800 dark:text-gray-200 mb-4">
              Join our WhatsApp group to stay connected with the community.
            </p>
            <div className="flex justify-center">
              <a
                href="https://chat.whatsapp.com/ERMH6rdc1h52aTL6eib793"
                target="blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition"
              >
                Join WhatsApp Community
              </a>
            </div>
          </div>
        </div>
      )}
      </main>
    </>
  );
}