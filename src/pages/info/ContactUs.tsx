import { useState } from "react";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { selectCurrentUser } from "@/store/slices/authSlice"; // Adjust import if needed

export function ContactUsPage() {
  const currentUser = useSelector(selectCurrentUser);

  // Form state
  const [name, setName] = useState(currentUser?.name || currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Error state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    let newErrors = { name: '', email: '', subject: '', message: '' };
    let isValid = true;

    if (!trimmedName) {
      newErrors.name = 'Please enter your name.';
      isValid = false;
    }
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address.';
      isValid = false;
    }
    if (!trimmedSubject) {
      newErrors.subject = 'Please enter a subject.';
      isValid = false;
    }
    if (!trimmedMessage) {
      newErrors.message = 'Please enter your message.';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    // Replace with your actual WhatsApp business number (no '+' or spaces, e.g. 919876543210)
    const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;

    // Construct the WhatsApp message
    let whatsAppText = `Hello Support,\n\n`;
    whatsAppText += `My name is *${trimmedName}*`;
    if (currentUser?._id) {
      whatsAppText += ` (User ID: ${currentUser._id})`;
    }
    whatsAppText += `\n`;
    whatsAppText += `Email: ${trimmedEmail}\n`;

    if (orderId.trim()) {
      whatsAppText += `Order ID: *#${orderId.trim()}*\n`;
    }

    whatsAppText += `Subject: *${trimmedSubject}*\n\n`;
    whatsAppText += `Message:\n${trimmedMessage}`;

    // Encode and redirect in the same tab
    const encodedMessage = encodeURIComponent(whatsAppText);
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-12 text-center sm:text-left">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Contact Us
        </h1>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
        
        {/* Contact Info Side Cards */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-medium text-foreground">Reach out to us</h3>
            <p className="font-sans text-xs text-secondary leading-relaxed">
              Have questions about your order, shipping details, or our curated collection? Our team is always here to help.
            </p>

            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-start gap-3 pt-4">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="block font-sans text-xs font-semibold text-foreground">Email us</span>
                  <span className="font-sans text-xs text-secondary">roomvintage430@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="block font-sans text-xs font-semibold text-foreground">Call us</span>
                  <span className="font-sans text-xs text-secondary">+91 8416883375
</span> 
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="block font-sans text-xs font-semibold text-foreground">Location</span>
                  <span className="font-sans text-xs text-secondary"> Muftigunj chauraha in front of agha house </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Send size={20} />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground">Message Sent Successfully!</h3>
              <p className="font-sans text-sm text-secondary max-w-md mx-auto">
                Thank you for reaching out. Our support team will review your message and get back to you via email shortly.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline" 
                  size="md"
                >
                  Send Another Message
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">Send us a message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block font-sans text-xs font-semibold text-primary mb-1">
                    Your Name <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="Enter your name"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 transition-all ${
                      errors.name ? 'border-[#B42318] focus:ring-[#B42318]' : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                  />
                  {errors.name && <p className="text-[#B42318] text-[11px] mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-sans text-xs font-semibold text-primary mb-1">
                    Email Address <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 transition-all ${
                      errors.email ? 'border-[#B42318] focus:ring-[#B42318]' : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                  />
                  {errors.email && <p className="text-[#B42318] text-[11px] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order ID */}
                <div>
                  <label className="block font-sans text-xs font-semibold text-primary mb-1">
                    Order ID <span className="text-secondary/50 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. 10492"
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-sans text-xs font-semibold text-primary mb-1">
                    Subject <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors({ ...errors, subject: '' });
                    }}
                    placeholder="What is this regarding?"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 transition-all ${
                      errors.subject ? 'border-[#B42318] focus:ring-[#B42318]' : 'border-border focus:border-primary focus:ring-primary'
                    }`}
                  />
                  {errors.subject && <p className="text-[#B42318] text-[11px] mt-1">{errors.subject}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-sans text-xs font-semibold text-primary mb-1">
                  Message <span className="text-[#B42318]">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder="Describe your question or issue in detail..."
                  rows={4}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 transition-all resize-y ${
                    errors.message ? 'border-[#B42318] focus:ring-[#B42318]' : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.message && <p className="text-[#B42318] text-[11px] mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  className="w-full sm:w-auto justify-center"
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;