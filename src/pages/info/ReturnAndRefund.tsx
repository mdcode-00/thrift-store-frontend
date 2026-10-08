import  { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice'; // Adjust import based on your store file path

export default function WhatsAppSupportForm() {
  // 1. Get the current user from Redux store
  const currentUser = useSelector(selectCurrentUser);

  // 2. Local state for form fields
  // If user is logged in, pre-fill the name; otherwise leave it empty
  const [name, setName] = useState(currentUser?.name || currentUser?.name || '');
  const [orderId, setOrderId] = useState('');
  const [problem, setProblem] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    orderId: '',
    problem: '',
  });

  const handleWhatsAppRedirect = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedOrderId = orderId.trim();
    const trimmedProblem = problem.trim();

    // Validate fields and set specific errors
    let newErrors = { name: '', orderId: '', problem: '' };
    let isValid = true;

    if (!trimmedName) {
      newErrors.name = 'Please enter your name.';
      isValid = false;
    }
    if (!trimmedOrderId) {
      newErrors.orderId = 'Please enter your Order ID.';
      isValid = false;
    }
    if (!trimmedProblem) {
      newErrors.problem = 'Please describe your problem or query.';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    // Replace with your actual WhatsApp business/support number (no '+' or spaces, e.g. 919876543210)
    const phoneNumber = String(import.meta.env.VITE_PHONE_NUMBER );

    // 3. Construct the message including User ID, Name, Order ID, and Problem
    let message = `Hello Support,\n\n`;
    message += `My name is *${trimmedName}*`;
    if (currentUser?._id) {
      message += ` (User ID: ${currentUser._id})`;
    }
    message += `.\n`;

    if (trimmedOrderId) {
      message += `Order ID: *#${trimmedOrderId}*\n`;
    }

    message += `\nMy problem/query is:\n${trimmedProblem}`;

    // 4. Encode and redirect to WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen bg-[#F5F0E9] flex items-center justify-center p-4">
      <div className="bg-[#FBF8F3] border border-[#D5C7B8] rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-[#6B4A38] text-2xl font-bold mb-2">WhatsApp Support</h2>
        <p className="text-[#8A654D] text-sm mb-6">
          {currentUser 
            ? `Logged in as ${currentUser.name || currentUser.email}. We've auto-filled your details.` 
            : "Please enter your details and order ID below to connect with us."}
        </p>

        <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-[#6B4A38] mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D5C7B8] rounded-lg text-[#3E2B22] focus:outline-none focus:border-[#B79A7D] focus:ring-2 focus:ring-[#B79A7D]/20 transition-all"
            />
              {errors.name && <p className="text-[#B42318] text-xs mt-1">{errors.name}</p>}
          </div>
        
          {/* Order ID Field */}
          <div>
            <label className="block text-sm font-semibold text-[#6B4A38] mb-1">Order ID <span className="text-[#8A654D] font-normal text-xs">(Optional)</span></label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 10492"
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D5C7B8] rounded-lg text-[#3E2B22] focus:outline-none focus:border-[#B79A7D] focus:ring-2 focus:ring-[#B79A7D]/20 transition-all"
            />
            {errors.orderId && <p className="text-[#B42318] text-xs mt-1">{errors.orderId}</p>}
          </div>

          {/* Problem / Query Field */}
          <div>
            <label className="block text-sm font-semibold text-[#6B4A38] mb-1">Problem / Query</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your issue or question here..."
              required
              rows={4}
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D5C7B8] rounded-lg text-[#3E2B22] focus:outline-none focus:border-[#B79A7D] focus:ring-2 focus:ring-[#B79A7D]/20 transition-all resize-vertical"
            />
            {errors.problem && <p className="text-[#B42318] text-xs mt-1">{errors.problem}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#6B4A38] hover:bg-[#8A654D] text-[#FFFFFF] font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2zM12.04 20.15c-1.42 0-2.81-.38-4.03-1.1l-.29-.17-3.05.8.81-2.97-.19-.31c-.81-1.31-1.24-2.83-1.24-4.38 0-4.58 3.73-8.31 8.31-8.31 2.22 0 4.31.86 5.88 2.43 1.57 1.57 2.43 3.66 2.43 5.88 0 4.58-3.73 8.31-8.31 8.31zm4.56-6.19c-.25-.13-1.48-.73-1.71-.82-.23-.09-.4-.13-.57.13-.17.25-.66.82-.81.99-.15.17-.31.19-.56.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.39.11-.52.12-.12.25-.31.38-.47.13-.17.17-.28.25-.47.08-.19.04-.36-.02-.5-.06-.13-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.12.17 1.76 2.69 4.27 3.77.6.26 1.07.41 1.44.53.61.19 1.16.16 1.6-.02.49-.2 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3z"/>
            </svg>
            <span>Send to WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}