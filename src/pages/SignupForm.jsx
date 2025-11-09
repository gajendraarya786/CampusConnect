import React, { useState } from 'react';
import { Eye, EyeOff, Upload, X, Check, User, Mail, Lock, Calendar, Phone, Github, Linkedin, Code, FileText, Tag } from 'lucide-react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    branch: "",
    year: "",
    gender: "",
    dob: "",
    mobile: "",
    linkedIn: "",
    github: "",
    leetcode: "",
    bio: "",
    skills: "",
  });

  const [message, setMessage] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Personal details' },
    { id: 2, title: 'Academic Info', description: 'University details' },
    { id: 3, title: 'Social Links', description: 'Optional profiles' },
    { id: 4, title: 'Profile Images', description: 'Avatar & cover' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (e.target.name === "avatar") {
        setAvatar(file);
        setAvatarPreview(event.target.result);
      }
      if (e.target.name === "coverImage") {
        setCoverImage(file);
        setCoverPreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type) => {
    if (type === 'avatar') {
      setAvatar(null);
      setAvatarPreview(null);
    } else {
      setCoverImage(null);
      setCoverPreview(null);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.password.trim()) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (step === 2) {
      if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
      if (!formData.year.trim()) newErrors.year = 'Year is required';
      if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
      if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    
    if (!avatar) {
      setMessage("Error: Avatar is required");
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    const data = new FormData();
    
    // Add all form fields to FormData
    data.append("fullname", formData.fullname.trim());
    data.append("email", formData.email.trim().toLowerCase());
    data.append("username", formData.username.trim().toLowerCase());
    data.append("password", formData.password);
    data.append("branch", formData.branch.trim());
    data.append("year", formData.year.trim());
    data.append("gender", formData.gender);
    data.append("dob", formatDateForBackend(formData.dob)); // Convert to DD/MM/YYYY
    data.append("mobile", formData.mobile.trim());
    
    // Optional fields
    if (formData.linkedIn) data.append("linkedIn", formData.linkedIn.trim());
    if (formData.github) data.append("github", formData.github.trim());
    if (formData.leetcode) data.append("leetcode", formData.leetcode.trim());
    if (formData.bio) data.append("bio", formData.bio.trim());
    if (formData.skills) data.append("skills", formData.skills.trim());
    
    // Add files
    if (avatar) data.append("avatar", avatar);
    if (coverImage) data.append("coverImage", coverImage);

    try {
      const response = await axiosInstance.post('/users/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Registration successful", response.data);
      setMessage("Account created successfully! Welcome to our community.");

      // Reset form
      setFormData({
        fullname: "",
        email: "",
        username: "",
        password: "",
        branch: "",
        year: "",
        gender: "",
        dob: "",
        mobile: "",
        linkedIn: "",
        github: "",
        leetcode: "",
        bio: "",
        skills: "",
      });
      setAvatar(null);
      setCoverImage(null);
      setAvatarPreview(null);
      setCoverPreview(null);
      setCurrentStep(1);

      // Optionally redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      console.error("Registration error", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Registration failed (${error.response.status})`;
        
        // Handle specific error codes
        if (error.response.status === 409) {
          setMessage("Error: Username or email already exists. Please use a different one.");
        } else {
          setMessage(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        setMessage("Error: Unable to connect to server. Please check if the server is running.");
      } else {
        setMessage("Error: Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (field) => {
    const icons = {
      fullname: User, email: Mail, username: User, password: Lock,
      dob: Calendar, mobile: Phone, github: Github, linkedIn: Linkedin,
      leetcode: Code, bio: FileText, skills: Tag
    };
    return icons[field] || User;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's get started</h3>
              <p className="text-gray-600">Create your account with basic information</p>
            </div>
            
            {['fullname', 'email', 'username', 'password'].map((field) => {
              const Icon = getStepIcon(field);
              return (
                <div key={field} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={field === "password" ? (showPassword ? "text" : "password") : field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    />
                    {field === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    )}
                  </div>
                  {errors[field] && <p className="mt-2 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors[field]}</p>}
                </div>
              );
            })}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Academic Details</h3>
              <p className="text-gray-600">Tell us about your university information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['branch', 'year'].map((field) => (
                <div key={field} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder={`Enter your ${field}`}
                  />
                  {errors[field] && <p className="mt-2 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors[field]}</p>}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="mt-2 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.gender}</p>}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.dob && <p className="mt-2 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.dob}</p>}
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your mobile number"
                />
              </div>
              {errors.mobile && <p className="mt-2 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.mobile}</p>}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Social Profiles</h3>
              <p className="text-gray-600">Connect your social and professional profiles (optional)</p>
            </div>
            
            {[
              { field: 'linkedIn', icon: Linkedin, placeholder: 'LinkedIn profile URL', color: 'text-blue-600' },
              { field: 'github', icon: Github, placeholder: 'GitHub profile URL', color: 'text-gray-800' },
              { field: 'leetcode', icon: Code, placeholder: 'LeetCode profile URL', color: 'text-orange-600' }
            ].map(({ field, icon: Icon, placeholder, color }) => (
              <div key={field} className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{field}</label>
                <div className="relative">
                  <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${color}`} />
                  <input
                    type="url"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200"
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}
            
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 resize-none"
                    placeholder="Tell us something about yourself..."
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200"
                    placeholder="e.g., JavaScript, React, Python (comma separated)"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Images</h3>
              <p className="text-gray-600">Upload your avatar and cover image</p>
            </div>
            
            <div className="space-y-8">
              {/* Avatar Upload */}
              <div className="text-center">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Profile Avatar *</label>
                <div className="flex flex-col items-center">
                  {avatarPreview ? (
                    <div className="relative">
                      <img src={avatarPreview} alt="Avatar preview" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
                      <button
                        type="button"
                        onClick={() => removeImage('avatar')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Upload Avatar</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="avatar"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Cover Image Upload */}
              <div className="text-center">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Cover Image</label>
                <div className="flex flex-col items-center">
                  {coverPreview ? (
                    <div className="relative">
                      <img src={coverPreview} alt="Cover preview" className="w-full h-48 rounded-xl object-cover border-2 border-blue-500" />
                      <button
                        type="button"
                        onClick={() => removeImage('cover')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-full">
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-500 transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Upload Cover Image</span>
                          <p className="text-xs text-gray-400 mt-1">16:9 ratio recommended</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="coverImage"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Our Community</h1>
          <p className="text-lg text-gray-600">Connect with students and professionals</p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-2xl p-6 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-semibold ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}
        
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !avatar}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    isLoading || !avatar
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Already have an account? <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;