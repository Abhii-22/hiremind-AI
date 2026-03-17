import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Abhishek',
    email: 'abhi@gmail.com'
  });
  
  const [skills, setSkills] = useState(['React', 'Node', 'Python']);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setProfileData(prev => ({
        ...prev,
        name: user.name || 'Abhishek',
        email: user.email || 'abhi@gmail.com'
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const handleSaveChanges = () => {
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify({
      ...JSON.parse(localStorage.getItem('user') || '{}'),
      name: profileData.name,
      email: profileData.email,
      skills: skills
    }));

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    console.log('Profile saved:', { profileData, skills, resumeFile });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">Manage your personal information</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="success-message">
            Profile updated successfully!
          </div>
        )}

        {/* Profile Form */}
        <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={profileData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="form-section">
            <h2 className="section-title">Skills</h2>
            
            <div className="skills-container">
              {skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    className="skill-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="add-skill-container">
              <input
                type="text"
                className="add-skill-input"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button
                type="button"
                className="add-skill-btn"
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-section">
            <h2 className="section-title">Upload Resume</h2>
            
            <div className="resume-upload">
              <div
                className="upload-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-input').click()}
              >
                <div className="upload-icon">📄</div>
                <div className="upload-text">
                  {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                </div>
                <div className="upload-hint">PDF files only (MAX. 5MB)</div>
                <input
                  id="resume-input"
                  type="file"
                  className="file-input"
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </div>

              {resumeFile && (
                <div className="file-info">
                  <span className="file-name">{resumeFile.name}</span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                type="button"
                className="upload-btn"
                onClick={() => document.getElementById('resume-input').click()}
              >
                Upload
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
